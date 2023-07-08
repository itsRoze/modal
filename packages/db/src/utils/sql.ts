import { sql } from "drizzle-orm";
import { char, timestamp } from "drizzle-orm/mysql-core";

export { createId } from "@paralleldrive/cuid2";

export const cuid = (name: string) => char(name, { length: 24 });
export const id = {
  id: cuid("id").notNull().primaryKey(),
};

export const timestamps = {
  timeCreated: timestamp("time_created", {
    mode: "string",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  timeUpdated: timestamp("time_updated", {
    mode: "string",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
};
