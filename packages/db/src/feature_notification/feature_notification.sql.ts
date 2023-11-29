import { relations } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { user } from "../user/user.sql";
import { id, timestamps } from "../utils/sql";

export const feature_notification = mysqlTable(
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
