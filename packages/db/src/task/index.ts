import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { zod } from "../utils/zod";
import { task } from "./task.sql";

export * as Task from "./";

export const Info = createSelectSchema(task, {
  id: (schema) => schema.id.cuid2(),
  name: (schema) => schema.name.nonempty(),
  deadline: (schema) => schema.deadline.nullable(),
  priority: (schema) => schema.priority,
  completedTime: (schema) => schema.completedTime,
  listType: (schema) => schema.listType,
  listId: (schema) => schema.listId.cuid2(),
  userId: (schema) => schema.userId.nonempty(),
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({
    name: true,
    deadline: true,
    priority: true,
    completedTime: true,
    listType: true,
    listId: true,
    userId: true,
  }).partial({
    deadline: true,
    priority: true,
    completedTime: true,
  }),
  async (input) => {
    const id = createId();
    await db.insert(task).values({
      id,
      ...input,
    });

    return id;
  },
);

export const remove = zod(
  Info.shape.id,
  async (taskId) =>
    await db.transaction(async (tx) => {
      await tx.delete(task).where(eq(task.id, taskId)).execute();
    }),
);

export const update = zod(
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
  async (input) =>
    await db.transaction(async (tx) => {
      const { id, ...rest } = input;
      return await tx.update(task).set(rest).where(eq(task.id, id)).execute();
    }),
);

export const getAll = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(task)
      .where(eq(task.userId, userId))
      .orderBy(task.timeUpdated)
      .execute();
  }),
);

export const getAllForList = zod(
  Info.pick({ listType: true, listId: true }),
  async ({ listType, listId }) =>
    db.transaction(async (tx) => {
      return tx
        .select()
        .from(task)
        .where(
          and(
            eq(task.listType, listType),
            eq(task.listId, listId),
            isNull(task.completedTime),
          ),
        )
        .orderBy(task.timeUpdated)
        .execute();
    }),
);

export const getAllCompleted = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(task)
      .where(and(eq(task.userId, userId), isNotNull(task.completedTime)))
      .orderBy(task.timeUpdated)
      .limit(50)
      .execute();
  }),
);
