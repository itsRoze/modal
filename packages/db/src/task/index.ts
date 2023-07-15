import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
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
      await tx.delete(task).where(eq(task.id, taskId));
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
        .where(and(eq(task.listType, listType), eq(task.listId, listId)))
        .orderBy(task.timeUpdated)
        .execute();
    }),
);
