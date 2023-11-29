import { auth } from "@modal/auth";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { FeatureNotification } from "../feature_notification";
import { zod } from "../utils/zod";
import { user } from "./user.sql";

export { user } from "./user.sql";

export * as User from "./";

export const Info = createSelectSchema(user, {
  id: (schema) => schema.id.min(1).max(15),
  email: (schema) => schema.email.email(),
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({ id: true, email: true }).partial({
    id: true,
  }),
  async (input) => {
    // Create User
    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: input.email,
        password: null,
      },
      attributes: {
        email: input.email,
      },
    });

    // Create Record to Display Welcome
    if (user) {
      await FeatureNotification.create({
        userId: user.userId,
        modalType: "welcome",
        showModal: true,
      });
    }

    return user;
  },
);

export const fromId = zod(Info.shape.id, async (id) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(user)
      .where(eq(user.id, id))
      .execute()
      .then((rows) => rows[0]);
  }),
);

export const fromEmail = zod(Info.shape.email, async (email) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(user)
      .where(eq(user.email, email))
      .execute()
      .then((rows) => rows[0]);
  }),
);
