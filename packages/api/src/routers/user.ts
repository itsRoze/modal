import { User } from "@modal/db/src/user";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    const data = await db
      .select({
        subscriptionStatus: User.user.stripeSubscriptionStatus,
      })
      .from(User.user)
      .where(eq(User.user.id, session.userId));

    const user = data[0];
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user.subscriptionStatus;
  }),
});
