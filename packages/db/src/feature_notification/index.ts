import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { zod } from "../utils/zod";
import { feature_notification } from "./feature_notification.sql";

export { feature_notification } from "./feature_notification.sql";

export * as FeatureNotification from "./";

export const Info = createSelectSchema(feature_notification, {
  id: (schema) => schema.id.cuid2(),
  userId: (schema) => schema.userId,
  modalType: (schema) => schema.modalType,
  showModal: (schema) => schema.showModal,
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({ userId: true, modalType: true, showModal: true }),
  async (input) => {
    const id = createId();

    await db.transaction(async (tx) => {
      await tx.insert(feature_notification).values({
        id,
        userId: input.userId,
        modalType: input.modalType,
        showModal: input.showModal,
      });
    });

    return id;
  },
);

export const update = zod(
  Info.pick({ id: true, modalType: true, showModal: true }),
  async (input) => {
    await db
      .update(feature_notification)
      .set({ modalType: input.modalType, showModal: input.showModal })
      .where(eq(feature_notification.id, input.id));
  },
);

export const updateByUserId = zod(
  Info.pick({ userId: true, modalType: true, showModal: true }),
  async (input) => {
    await db
      .update(feature_notification)
      .set({ showModal: input.showModal })
      .where(
        and(
          eq(feature_notification.userId, input.userId),
          eq(feature_notification.modalType, input.modalType),
        ),
      );
  },
);

export const fromUserId = zod(
  Info.pick({ userId: true, modalType: true }),
  async (input) =>
    db.transaction(async (tx) => {
      return tx
        .select()
        .from(feature_notification)
        .where(
          and(
            eq(feature_notification.userId, input.userId),
            eq(feature_notification.modalType, input.modalType),
          ),
        )
        .execute()
        .then((rows) => rows[0]);
    }),
);
