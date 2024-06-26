import {
  DUE_SOON_DAYS,
  getDeadlineDiffFromToday,
  sortTasks,
} from "@modal/common";
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
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
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
        listType: true,
        listId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      await ratelimit(
        ratelimiter,
        `taskCreate-${userId}`,
        "You are creating tasks too fast",
      );

      return await create({ ...input, userId: ctx.session.userId });
    }),
  remove: protectedProcedure
    .input(Info.shape.id)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(
        ratelimiter,
        `taskeRemove-${userId}`,
        "You are deleting tasks too fast",
      );

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

      await ratelimit(
        ratelimiter,
        `taskUpdate-${userId}`,
        "You are modifying tasks too fast",
      );

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
  getSomedayTasksByList: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const tasks = await db.transaction(async (tx) => {
      const spaceTasks = await tx.query.space.findMany({
        where: (space) => and(eq(space.userId, session.userId)),
        with: {
          tasks: {
            where: (task) =>
              and(isNull(task.completedTime), isNull(task.deadline)),
          },
        },
      });

      const projectTasks = await tx.query.project.findMany({
        where: (project) => and(eq(project.userId, session.userId)),
        with: {
          tasks: {
            where: (task) =>
              and(isNull(task.completedTime), isNull(task.deadline)),
          },
        },
      });

      const unassignedTasks = await tx
        .select()
        .from(task)
        .where(
          and(
            eq(task.userId, session.userId),
            isNull(task.listType),
            isNull(task.listId),
            isNull(task.completedTime),
            isNull(task.deadline),
          ),
        );

      return {
        spaceTasks,
        projectTasks,
        unassignedTasks,
      };
    });

    return tasks ?? { spaceTasks: [], projectTasks: [] };
  }),
  getSomedayTaskCount: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const tasks = await db
      .select({ count: sql<number>`count(*)` })
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.completedTime),
          isNull(task.deadline),
        ),
      )
      .orderBy(task.listId);

    return tasks[0] ? tasks[0].count : 0;
  }),
  getUnassigned: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    const tasks = await db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, session.userId),
          isNull(task.listType),
          isNull(task.listId),
          isNull(task.completedTime),
        ),
      );

    return tasks;
  }),
  getListInfo: protectedProcedure
    .input(Info.pick({ listId: true, listType: true }))
    .query(async ({ input }) => {
      if (!input.listId || !input.listType) {
        return null;
      }

      const listData =
        input.listType === "space"
          ? await fromSpaceId(input.listId)
          : await fromProjectId(input.listId);

      if (!listData) {
        return null;
      }

      return listData;
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
      )
      .orderBy(task.deadline);
    const tasksDueSoon = tasks.filter(
      (t) =>
        t.deadline && getDeadlineDiffFromToday(t.deadline) <= DUE_SOON_DAYS,
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
      )
      .orderBy(task.deadline);

    const tasksDueLater = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) > DUE_SOON_DAYS,
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
      )
      .orderBy(task.deadline);

    const tasksDueSoon = tasks.filter(
      (t) =>
        t.deadline && getDeadlineDiffFromToday(t.deadline) <= DUE_SOON_DAYS,
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
      )
      .orderBy(task.deadline);

    const tasksDueLater = tasks.filter(
      (t) => t.deadline && getDeadlineDiffFromToday(t.deadline) > DUE_SOON_DAYS,
    );

    return tasksDueLater ?? [];
  }),
});
