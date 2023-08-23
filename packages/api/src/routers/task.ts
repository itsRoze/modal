import { getDeadlineDiffFromToday, sortTasks } from "@modal/common";
import { fromID as fromProjectId } from "@modal/db/src/project";
import { fromID as fromSpaceId } from "@modal/db/src/space";
import {
  Info,
  create,
  getAll,
  getAllCompleted,
  getAllForList,
  remove,
  update,
} from "@modal/db/src/task";
import { task } from "@modal/db/src/task/task.sql";
import { Ratelimit } from "@upstash/ratelimit";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";

import { ratelimit } from "../ratelimit";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// 5 requests per 5 seconds
const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 s"),
  analytics: true,
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      Info.pick({
        name: true,
        deadline: true,
        priority: true,
        listType: true,
        listId: true,
      }).partial({
        deadline: true,
        priority: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      await ratelimit(ratelimiter, userId, "You are creating tasks too fast");

      return await create({ ...input, userId: ctx.session.userId });
    }),
  remove: protectedProcedure
    .input(Info.shape.id)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(ratelimiter, userId, "You are deleting tasks too fast");

      return await remove(input);
    }),
  update: protectedProcedure
    .input(
      Info.pick({
        id: true,
        name: true,
        listId: true,
        listType: true,
        deadline: true,
        completedTime: true,
        priority: true,
      }).partial({
        name: true,
        listId: true,
        listType: true,
        deadline: true,
        completedTime: true,
        priority: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(ratelimiter, userId, "You are modifying tasks too fast");

      const result = await update(input);
      if (result) {
        return input;
      }
    }),
  getAllForList: protectedProcedure
    .input(Info.pick({ listId: true, listType: true }))
    .query(async ({ input }) => {
      const result = await getAllForList(input);
      return sortTasks(result) ?? [];
    }),
  getAllForUser: protectedProcedure
    .input(z.optional(Info.shape.userId))
    .query(async ({ ctx, input }) => {
      const results = await getAll(input ?? ctx.session.userId);
      return results ?? [];
    }),
  getAllCompletedForUser: protectedProcedure
    .input(z.optional(Info.shape.userId))
    .query(async ({ ctx, input }) => {
      const result = await getAllCompleted(input ?? ctx.session.userId);
      return result ?? [];
    }),
  getListInfo: protectedProcedure
    .input(Info.pick({ listId: true, listType: true }))
    .query(async ({ input }) => {
      if (input.listType === "space") {
        return await fromSpaceId(input.listId);
      }
      return await fromProjectId(input.listId);
    }),
  getDashboardTasks: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNotNull(task.deadline),
        ),
      );
    return tasks ?? [];
  }),
  getImportantAndDueSoon: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNotNull(task.deadline),
          eq(task.priority, true),
        ),
      );

    const tasksDueSoon = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) <= 3,
    );

    return tasksDueSoon ?? [];
  }),
  getImportantAndDueLater: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNotNull(task.deadline),
          eq(task.priority, true),
        ),
      );

    const tasksDueLater = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) > 3,
    );

    return tasksDueLater ?? [];
  }),
  getNotImportantAndDueSoon: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNotNull(task.deadline),
          eq(task.priority, false),
        ),
      );

    const tasksDueSoon = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) <= 3,
    );

    return tasksDueSoon ?? [];
  }),
  getNotImportantAndDueLater: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNotNull(task.deadline),
          eq(task.priority, false),
        ),
      );

    const tasksDueLater = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) > 3,
    );

    return tasksDueLater ?? [];
  }),
});
