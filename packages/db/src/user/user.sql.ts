import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { timestamps } from "../utils/sql";

export const user = mysqlTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  // other user attributes
  email: varchar("email", { length: 255 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  }),
  stripeSubscriptionStatus: mysqlEnum("stripe_subscription_status", [
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "paused",
  ]),

  ...timestamps,
});
