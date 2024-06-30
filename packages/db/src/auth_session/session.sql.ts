import { bigint, pgTableCreator, varchar } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const session = pgTable("auth_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});
