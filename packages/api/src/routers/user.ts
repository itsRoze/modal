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
  getLists: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    return await db.transaction(async (tx) => {
      const spaces = await tx.query.space.findMany({
        where: (space) => eq(space.userId, session.userId),
      });
      const spacesWithType = spaces.map((userSpace) => ({
        ...userSpace,
        type: "space",
      }));

      const projects = await tx.query.project.findMany({
        where: (project) => eq(project.userId, session.userId),
      });

      const projectsWithType = projects.map((userProject) => ({
        ...userProject,
        type: "project",
      }));

      return [...spacesWithType, ...projectsWithType].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    });
  }),
});
