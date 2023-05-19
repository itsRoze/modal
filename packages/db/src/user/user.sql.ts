import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { timestamps } from "../utils/sql";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 15 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  ...timestamps,
});
