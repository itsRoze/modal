import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { project } from "../project/project.sql";
import { space } from "../space/space.sql";
import { user } from "../user/user.sql";
import { cuid, id, timestamps } from "../utils/sql";

export const task = mysqlTable(
  "task",
  {
    ...id,
    ...timestamps,
    name: varchar("name", { length: 50 }).notNull(),
    deadline: date("deadline"),
    priority: boolean("priority").default(false),
    completedTime: date("completed_time"),
    listType: mysqlEnum("listType", ["space", "project"]).notNull(),
    listId: cuid("listId").notNull(),
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
  },
  (task) => ({
    primary: primaryKey(task.id),
    list: index("list").on(task.listType, task.listId),
    user: index("user").on(task.userId),
  }),
);

export const taskRelations = relations(task, ({ one }) => ({
  space: one(space, {
    fields: [task.listId],
    references: [space.id],
  }),
  project: one(project, {
    fields: [task.listId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
}));
