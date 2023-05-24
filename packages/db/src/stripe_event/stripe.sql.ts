import {
  boolean,
  int,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const stripeEvent = mysqlTable("stripe_event", {
  id: varchar("id", { length: 15 }).primaryKey(),
  api_version: varchar("api_version", { length: 255 }),
  data: json("data").notNull(),
  request: json("request"),
  type: varchar("type", { length: 255 }).notNull(),
  object: varchar("object", { length: 255 }).notNull(),
  account: varchar("account", { length: 255 }),
  created: timestamp("created").notNull(),
  livemode: boolean("livemode").notNull(),
  pending_webhooks: int("pending_webhooks").notNull(),
});
