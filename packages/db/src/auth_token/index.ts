import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { zod } from "../utils/zod";
import { auth_token } from "./token.sql";

export { auth_token } from "./token.sql";

export * as Token from "./";

export const Info = createSelectSchema(auth_token, {
  id: (schema) => schema.id.min(1).max(255),
  userId: (schema) => schema.userId.min(1).max(15),
  token: (schema) => schema.token.nonempty(),
  expires: (schema) => schema.expires,
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({
    userId: true,
    token: true,
    expires: true,
  }),
  async (input) => {
    const id = createId();
    await db.insert(auth_token).values({
      id,
      ...input,
    });

    return id;
  },
);

export const getByUserIdAndToken = zod(
  Info.pick({ userId: true, token: true }),
  async (input) =>
    db.transaction(async (tx) => {
      return tx.query.auth_token.findFirst({
        where: (auth_token) =>
          and(
            eq(auth_token.userId, input.userId),
            eq(auth_token.token, input.token),
          ),
      });
    }),
);

export const deleteByUserId = zod(Info.shape.userId, async (userId) =>
  db.transaction(async (tx) => {
    return tx.delete(auth_token).where(eq(auth_token.userId, userId));
  }),
);
