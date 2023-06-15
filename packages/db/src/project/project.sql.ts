import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { space } from "../space/space.sql";
import { user } from "../user/user.sql";
import { cuid, id, timestamps } from "../utils/sql";

export const project = mysqlTable("project", {
  ...id,
  ...timestamps,

  name: varchar("name", { length: 255 }).notNull(),
  spaceId: cuid("space_id").notNull(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
});

export const projectRelations = relations(project, ({ one }) => ({
  space: one(space, {
    fields: [project.spaceId],
    references: [space.id],
  }),
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
}));
