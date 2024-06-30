import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgEnum,
  pgTableCreator,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { project } from "../project/project.sql";
import { space } from "../space/space.sql";
import { user } from "../user/user.sql";
import { cuid, id, timestamps } from "../utils/sql";

const pgTable = pgTableCreator((name) => `modal_${name}`);

export const listTypeEnum = pgEnum("listType", ["space", "project"]);

export const task = pgTable(
  "task",
  {
    ...id,
    ...timestamps,
    name: varchar("name", { length: 50 }).notNull(),
    deadline: date("deadline", {
      mode: "string",
    }),
    priority: boolean("priority").default(false).notNull(),
    completedTime: date("completed_time", {
      mode: "string",
    }),
    listType: listTypeEnum("listType"),
    listId: cuid("listId"),
    userId: varchar("user_id", {
      length: 15,
    }).notNull(),
  },
  (task) => ({
    primary: primaryKey(task.id),
    list: index("list_index").on(task.listType, task.listId),
    user: index("user_index").on(task.userId),
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
