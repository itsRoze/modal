import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { user } from "../user/user.sql";
import { id, timestamps } from "../utils/sql";

export const space = mysqlTable("space", {
  ...id,
  ...timestamps,
  name: varchar("name", { length: 255 }).notNull(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
});

export const spaceRelations = relations(space, ({ one }) => ({
  user: one(user, {
    fields: [space.userId],
    references: [user.id],
  }),
}));
