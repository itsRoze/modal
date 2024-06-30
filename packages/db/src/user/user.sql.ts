import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { project } from "../project/project.sql";
import { space } from "../space/space.sql";
import { task } from "../task/task.sql";
import { timestamps } from "../utils/sql";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const status = pgEnum("stripe_subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]);

export const user = pgTable("user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  // other user attributes
  email: varchar("email", { length: 255 }).notNull(),
  time_email_verified: timestamp("time_email_verified", {
    mode: "string",
  }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  }),
  stripeSubscriptionStatus: status("stripe_subscription_status"),
  ...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
  spaces: many(space),
  projects: many(project),
  tasks: many(task),
}));
