import { createId } from "@paralleldrive/cuid2";
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
