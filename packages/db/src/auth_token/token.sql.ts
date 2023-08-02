import { relations } from "drizzle-orm";
import {
  bigint,
  char,
  index,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { user } from "../user/user.sql";
import { id } from "../utils/sql";

export const auth_token = mysqlTable(
  "auth_token",
  {
    ...id,
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
    token: char("token", {
      length: 8,
    }).notNull(),
    expires: bigint("expires", {
      mode: "number",
    }).notNull(),
  },
  (token) => ({
    primary: primaryKey(token.id),
    user: index("user").on(token.userId),
  }),
);

export const tokenRelations = relations(auth_token, ({ one }) => ({
  user: one(user, {
    fields: [auth_token.userId],
    references: [user.id],
  }),
}));
