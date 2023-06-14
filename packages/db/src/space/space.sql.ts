import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { id, timestamps } from "../utils/sql";

export const space = mysqlTable("space", {
  ...id,
  ...timestamps,
  name: varchar("name", { length: 255 }).notNull(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
});
