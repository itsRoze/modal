import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { useTransaction } from "../utils/transaction";
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

    return useTransaction(async (tx) => {
      await tx.insert(project).values({
        id,
        name: input.name,
        spaceId: input.spaceId,
        userId: input.userId,
      });

      return id;
    });
  },
);

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
