import { relations } from "drizzle-orm";
import { pgTableCreator, primaryKey, varchar } from "drizzle-orm/pg-core";

import { project } from "../project/project.sql";
import { task } from "../task/task.sql";
import { user } from "../user/user.sql";
import { id, timestamps } from "../utils/sql";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const space = pgTable(
  "space",
  {
    ...id,
    ...timestamps,
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
  },
  (space) => ({
    primary: primaryKey(space.id),
  }),
);

export const spaceRelations = relations(space, ({ one, many }) => ({
  user: one(user, {
    fields: [space.userId],
    references: [user.id],
  }),
  projects: many(project),
  tasks: many(task),
}));
