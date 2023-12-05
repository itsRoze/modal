import { auth, generateToken, isWithinExpiration } from "@modal/auth";
import { dateToMySqlFormat } from "@modal/common";
import { Token, User } from "@modal/db";
import { Email } from "@modal/email";
import { z } from "zod";

import { APIError } from "./utils/APIError";
import { ApiZod } from "./utils/ApiZod";

export const getSession = ApiZod(
  z.object({ request: z.custom<Request>() }),
  async (input) => {
    const { request } = input;
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();
    return session;
  },
);

export const issueLoginToken = ApiZod(
  User.Info.pick({ email: true }),
  async (input) => {
    const { email } = input;

    // Find user
    const user = await User.fromEmail(email);
    if (!user) {
      throw new APIError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    // delete any dead sessions
    await auth.deleteDeadUserSessions(user.id);

    // delete previous tokens
    await Token.deleteByUserId(user.id);
    // generate new token
    const otp = generateToken();
    // save token to DB
    await Token.create({
      userId: user.id,
      ...otp,
    });

    if (process.env.NODE_ENV === "development") {
      console.log(otp);
    } else {
      await Email.sendTokenEmail({
        token: otp.token,
        userEmail: email,
        fromEmail: "no-reply@account.usemodal.com",
      });
    }

    const key = await auth.useKey("email", email, null);
    return { userId: key.userId };
  },
);

export const validateLogin = ApiZod(
  z.object({
    request: z.custom<Request>(),
    token: z.string(),
    userId: z.string(),
  }),
  async (input) => {
    console.log("made it here");
    const { userId, request } = input;

    const otp = await Token.getByUserIdAndToken(input);
    if (!otp) {
      throw new APIError({
        message: "Invalid token",
        code: "UNAUTHORIZED",
      });
    }

    console.log("made it here2");

    if (!isWithinExpiration(otp.expires)) {
      throw new APIError({
        message: "Token expired",
        code: "UNAUTHORIZED",
      });
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
    const cookie = auth.createSessionCookie(session);
    return cookie;
  },
);
