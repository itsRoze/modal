import { FeatureNotification } from "@modal/db";
import { User, fromId } from "@modal/db/src/user";
import { TRPCError } from "@trpc/server";
import { and, eq, like } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const filterDataForClient = (user: User.Info) => {
  const { id, email, time_email_verified, stripeSubscriptionStatus } = user;
  return {
    id,
    email,
    time_email_verified,
    stripeSubscriptionStatus,
  };
};

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const data = await fromId(session.userId);

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User ${session.userId} not found`,
      });
    }

    return filterDataForClient(data);
  }),
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
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User ${session.userId} not found`,
      });
    }

    return user.subscriptionStatus;
  }),
  isNewUser: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    const welcomeNotification = await FeatureNotification.fromUserId({
      userId: session.userId,
      modalType: "welcome",
    });

    if (!welcomeNotification) {
      // Record doesn't exist, meaning it's an older user
      // Create a record for them and return false
      await FeatureNotification.create({
        userId: session.userId,
        modalType: "welcome",
        showModal: false,
      });

      return false;
    }

    return welcomeNotification.showModal;
  }),
  getLists: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const lists = await db.transaction(async (tx) => {
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

    return lists.length > 0 ? lists : [];
  }),
  findList: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      if (!input) {
        return [];
      }

      const spaces = await db.query.space.findMany({
        where: (space) =>
          and(eq(space.userId, session.userId), like(space.name, `%${input}%`)),
      });

      const spacesWithType = spaces.map((userSpace) => ({
        ...userSpace,
        type: "space",
      }));

      const projects = await db.query.project.findMany({
        where: (project) =>
          and(
            eq(project.userId, session.userId),
            like(project.name, `%${input}%`),
          ),
      });

      const projectsWithType = projects.map((userProject) => ({
        ...userProject,
        type: "project",
      }));

      return [...spacesWithType, ...projectsWithType].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }),
});
