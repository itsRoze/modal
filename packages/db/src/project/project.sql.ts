import { relations } from "drizzle-orm";
import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

import { space } from "../space/space.sql";
import { task } from "../task/task.sql";
import { user } from "../user/user.sql";
import { cuid, id, timestamps } from "../utils/sql";

export const project = mysqlTable(
  "project",
  {
    ...id,
    ...timestamps,
    name: varchar("name", { length: 255 }).notNull(),
    spaceId: cuid("space_id"),
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
  },

  (project) => ({
    primary: primaryKey(project.id),
  }),
);

export const projectRelations = relations(project, ({ one, many }) => ({
  space: one(space, {
    fields: [project.spaceId],
    references: [space.id],
  }),
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  tasks: many(task),
}));
