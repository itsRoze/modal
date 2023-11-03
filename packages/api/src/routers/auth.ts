import { auth, isWithinExpiration, otpToken } from "@modal/auth";
import { dateToMySqlFormat } from "@modal/common";
import {
  create as createToken,
  deleteByUserId as deleteTokenByUserId,
  getByUserIdAndToken,
} from "@modal/db/src/auth_token";
import { create as createUser, fromEmail } from "@modal/db/src/user";
import { sendTokenEmail, sendWelcomeEmail } from "@modal/email";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { ratelimit } from "../ratelimit";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const ratelimiter = {
  // 10 requests per 1 minute
  app: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  }),
  user: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
  }),
};

export const authRouter = createTRPCRouter({
  issueLogin: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const { email } = input;

      const { success } = await ratelimiter.app.limit("login_issue");
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many login requests across the app. Please wait",
        });
      }

      await ratelimit(
        ratelimiter.user,
        `authLogin-${email}`,
        "You are making too many login requests. Please wait",
      );

      const user = await fromEmail(email);
      if (!user) throw new Error("No user found");
      const key = await auth.useKey("email", email, null);

      // delete any dead sessions
      await auth.deleteDeadUserSessions(user.id);

      // delete previous tokens
      await deleteTokenByUserId(user.id);
      // generate new token
      const otp = otpToken();
      // save token
      await createToken({
        userId: user.id,
        token: otp.token,
        expires: otp.expires,
      });

      if (process.env.NODE_ENV === "development") {
        console.log(otp);
      } else {
        await sendTokenEmail({
          token: otp.token,
          userEmail: email,
          fromEmail: "no-reply@account.usemodal.com",
        });
      }

      return { message: "OTP sent", userId: key.userId };
    }),
  validateLogin: publicProcedure
    .input(z.object({ userProvidedToken: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userProvidedToken, userId } = input;
      const { req, res } = ctx;

      const otp = await getByUserIdAndToken({
        token: userProvidedToken,
        userId,
      });

      if (!otp)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });

      // Check expiration
      if (!isWithinExpiration(otp.expires)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Expired token" });
      }

      const user = await auth.getUser(userId);

      // In case the user never verified their email, update it now
      if (!user.time_email_verified) {
        await auth.updateUserAttributes(userId, {
          time_email_verified: dateToMySqlFormat(new Date()),
        });
      }

      // Create a new session
      const session = await auth.createSession({
        userId: userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);

      return true;
    }),
  issueSignup: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const { email } = input;

      const { success } = await ratelimiter.app.limit("signup_issue");
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many signup requests across the app. Please wait",
        });
      }

      const user = await createUser({ email });

      if (!user) throw new Error("User not created");

      // delete previous tokens
      await deleteTokenByUserId(user.userId);
      // generate new token
      const otp = otpToken();
      // save token
      await createToken({
        userId: user.userId,
        token: otp.token,
        expires: otp.expires,
      });

      if (process.env.NODE_ENV === "development") {
        console.log(otp);
      } else {
        await sendTokenEmail({
          token: otp.token,
          userEmail: email,
          fromEmail: "no-reply@account.usemodal.com",
        });
      }

      return { message: "OTP sent", userId: user.userId, email };
    }),
  validateSignup: publicProcedure
    .input(z.object({ userProvidedToken: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userProvidedToken, userId } = input;
      const { req, res } = ctx;

      const otp = await getByUserIdAndToken({
        token: userProvidedToken,
        userId,
      });

      if (!otp)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });

      // Check expiration
      if (!isWithinExpiration(otp.expires)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Expired token" });
      }

      // Update user
      await auth.updateUserAttributes(userId, {
        time_email_verified: dateToMySqlFormat(new Date()),
      });

      const session = await auth.createSession({
        userId: userId,
        attributes: {},
      });

      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);

      // Send welcome email
      if (process.env.NODE_ENV !== "development") {
        const user = await auth.getUser(userId);
        await sendWelcomeEmail({
          userEmail: user.email,
          fromEmail: "no-reply@account.usemodal.com",
        });
      }

      return true;
    }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const { req, res } = ctx;

    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
    }

    await auth.invalidateSession(session.sessionId);
    await auth.deleteDeadUserSessions(session.user.userId);
    authRequest.setSession(null);

    return true;
  }),
});
