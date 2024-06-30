import { relations } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "../user/user.sql";
import { id, timestamps } from "../utils/sql";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const feature_notification = pgTable(
  "feature_notification",
  {
    ...id,
    ...timestamps,
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
    modalType: varchar("modal_type", { length: 50 }).notNull(),
    showModal: boolean("show_modal").default(true).notNull(),
  },

  (feature_notification) => ({
    primary: primaryKey(feature_notification.id),
  }),
);

export const feature_notificationRelations = relations(
  feature_notification,
  ({ one }) => ({
    user: one(user, {
      fields: [feature_notification.userId],
      references: [user.id],
    }),
  }),
);
