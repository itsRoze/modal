import { char, timestamp } from "drizzle-orm/pg-core";

export { createId } from "@paralleldrive/cuid2";

export const cuid = (name: string) => char(name, { length: 24 });
export const id = {
  id: cuid("id").notNull(),
};

export const timestamps = {
  timeCreated: timestamp("time_created", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  timeUpdated: timestamp("time_updated", {
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow(),
};
