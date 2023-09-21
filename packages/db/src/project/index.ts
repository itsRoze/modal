import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { space } from "../space/space.sql";
import { task } from "../task/task.sql";
import { zod } from "../utils/zod";
import { project } from "./project.sql";

export * as Project from "./";
export { project } from "./project.sql";

export const Info = createSelectSchema(project, {
  id: (schema) => schema.id.cuid2(),
  name: (schema) => schema.name.nonempty(),
  spaceId: (schema) => schema.spaceId.nonempty(),
  userId: (schema) => schema.userId.nonempty(),
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({ name: true, spaceId: true, userId: true }).partial({
    spaceId: true,
  }),
  async (input) => {
    const id = createId();

    await db.transaction(async (tx) => {
      if (input.spaceId) {
        const userSpace = await tx
          .select()
          .from(space)
          .where(eq(space.id, input.spaceId));

        if (!userSpace || userSpace.length !== 1) {
          throw new Error("Space not found");
        }
      }

      await tx.insert(project).values({
        id,
        name: input.name,
        spaceId: input.spaceId,
        userId: input.userId,
      });
    });

    return id;
  },
);

export const update = zod(
  Info.pick({ id: true, name: true, spaceId: true }),
  async (input) => {
    await db
      .update(project)
      .set({ name: input.name, spaceId: input.spaceId })
      .where(eq(project.id, input.id));
  },
);

export const remove = zod(Info.pick({ id: true }), async (input) => {
  await db.transaction(async (tx) => {
    await tx.delete(project).where(eq(project.id, input.id));
    await tx
      .delete(task)
      .where(and(eq(task.listType, "project"), eq(task.listId, input.id)));
  });
});

export const fromID = zod(Info.shape.id, async (id) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(project)
      .where(eq(project.id, id))
      .execute()
      .then((rows) => rows[0]);
  }),
);

export const getAll = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(project)
      .where(and(eq(project.userId, userId), isNull(project.spaceId)))
      .orderBy(project.name)
      .execute();
  }),
);
