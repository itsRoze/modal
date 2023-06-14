import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { useTransaction } from "../utils/transaction";
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

    return useTransaction(async (tx) => {
      await tx.insert(space).values({
        id,
        name: input.name,
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
      .from(space)
      .where(eq(space.id, id))
      .execute()
      .then((rows) => rows[0]);
  }),
);
