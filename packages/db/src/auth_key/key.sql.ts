import { pgTableCreator, varchar } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const key = pgTable("auth_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
