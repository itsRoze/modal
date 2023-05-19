import { User } from "@modal/db";
import { TRPCError } from "@trpc/server";
import { LuciaError } from "lucia-auth";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(User.userCreateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.auth.createUser({
          primaryKey: {
            providerId: "email",
            providerUserId: input.email,
            password: null,
          },
          attributes: {},
        });
      } catch (error) {
        console.log(error);
        if (error instanceof LuciaError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oh jeez, error creating user",
        });
      }
    }),
});
