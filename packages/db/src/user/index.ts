import { auth } from "@modal/auth";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { zod } from "../utils/zod";
import { user } from "./user.sql";

export * as User from "./";

export const Info = createSelectSchema(user, {
  id: (schema) => schema.id.min(1).max(15),
  email: (schema) => schema.email.email(),
});

export type Info = z.infer<typeof Info>;

export const userCreateSchema = Info.pick({ id: true, email: true }).partial({
  id: true,
});

export const create = zod(
  Info.pick({ id: true, email: true }).partial({
    id: true,
  }),
  async (input) => {
    await auth.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: input.email,
        password: null,
      },
      attributes: {
        email: input.email,
      },
    });
  },
);
