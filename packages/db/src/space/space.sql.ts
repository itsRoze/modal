import { relations } from "drizzle-orm";
import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

import { project } from "../project/project.sql";
import { task } from "../task/task.sql";
import { user } from "../user/user.sql";
import { id, timestamps } from "../utils/sql";

export const space = mysqlTable(
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
