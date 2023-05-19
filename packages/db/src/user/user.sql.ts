import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { timestamps } from "../utils/sql";

export const user = mysqlTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  // other user attributes
  // email: varchar("email", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),

  ...timestamps,
});
