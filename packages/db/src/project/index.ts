import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
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

    await db.insert(project).values({
      id,
      name: input.name,
      spaceId: input.spaceId,
      userId: input.userId,
    });

    return id;
  },
);

export const remove = zod(Info.pick({ id: true }), async (input) => {
  await db.delete(project).where(eq(project.spaceId, input.id));
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
