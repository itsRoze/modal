import {
  bigint,
  boolean,
  json,
  pgTableCreator,
  varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "../utils/sql";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const stripeEvent = pgTable("stripe_event", {
  id: varchar("id", { length: 255 }).primaryKey(),
  api_version: varchar("api_version", { length: 255 }),
  data: json("data").notNull(),
  request: json("request"),
  type: varchar("type", { length: 255 }).notNull(),
  object: varchar("object", { length: 255 }).notNull(),
  account: varchar("account", { length: 255 }),
  livemode: boolean("livemode").notNull(),
  pending_webhooks: bigint("pending_webhooks", { mode: "number" }).notNull(),
  ...timestamps,
});
