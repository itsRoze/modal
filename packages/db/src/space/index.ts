import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { project } from "../project/project.sql";
import { task } from "../task/task.sql";
import { zod } from "../utils/zod";
import { space } from "./space.sql";

export * as Space from "./";
export { space } from "./space.sql";

export const Info = createSelectSchema(space, {
  id: (schema) => schema.id.cuid2(),
  name: (schema) => schema.name.nonempty(),
  userId: (schema) => schema.userId.nonempty(),
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({ name: true, userId: true }),
  async (input) => {
    const id = createId();
    await db.insert(space).values({
      id,
      name: input.name,
      userId: input.userId,
    });

    return id;
  },
);

export const update = zod(
  Info.pick({ id: true, name: true }),
  async (input) => {
    await db
      .update(space)
      .set({ name: input.name })
      .where(eq(space.id, input.id));
  },
);

export const remove = zod(Info.pick({ id: true }), async (input) => {
  await db.transaction(async (tx) => {
    await tx.delete(space).where(eq(space.id, input.id));
    await tx.delete(project).where(eq(project.spaceId, input.id));
    await tx
      .delete(task)
      .where(and(eq(task.listType, "space"), eq(task.listId, input.id)));
  });
});

export const fromID = zod(Info.shape.id, async (id) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(space)
      .where(eq(space.id, id))
      .execute()
      .then((rows) => rows[0]);
  }),
);

export const getAllWithProjectsQuery = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx.query.space.findMany({
      where: (space) => eq(space.userId, userId),
      columns: {
        id: true,
        name: true,
      },
      with: {
        projects: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),
);

export const getAll = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(space)
      .where(eq(space.userId, userId))
      .orderBy(space.name)
      .execute();
  }),
);
