import {
  boolean,
  int,
  json,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

import { timestamps } from "../utils/sql";

export const stripeEvent = mysqlTable("stripe_event", {
  id: varchar("id", { length: 255 }).primaryKey(),
  api_version: varchar("api_version", { length: 255 }),
  data: json("data").notNull(),
  request: json("request"),
  type: varchar("type", { length: 255 }).notNull(),
  object: varchar("object", { length: 255 }).notNull(),
  account: varchar("account", { length: 255 }),
  livemode: boolean("livemode").notNull(),
  pending_webhooks: int("pending_webhooks").notNull(),
  ...timestamps,
});
