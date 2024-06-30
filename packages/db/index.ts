import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Config } from "sst/node/config";

import * as tokenSchema from "./src/auth_token/token.sql";
import * as featureNotificationSchema from "./src/feature_notification/feature_notification.sql";
import * as projectSchema from "./src/project/project.sql";
import * as spaceSchema from "./src/space/space.sql";
import * as taskSchema from "./src/task/task.sql";
import * as userSchena from "./src/user/user.sql";

const connection = {
  user: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  host: Config.DB_HOST,
};

const connectionString = `postgresql://${connection.user}:${connection.password}@${connection.host}/neondb?sslmode=require`;

const client = new Pool({ connectionString });

export const dbSchema = {
  ...projectSchema,
  ...spaceSchema,
  ...userSchena,
  ...taskSchema,
  ...tokenSchema,
  ...featureNotificationSchema,
};
export const db = drizzle(client, {
  schema: dbSchema,
});
export type db = typeof db;

export { User } from "./src/user";
export { StripeEvent } from "./src/stripe_event";
export { Space } from "./src/space";
export { Project } from "./src/project";
export { Task } from "./src/task";
export { Token } from "./src/auth_token";
export { FeatureNotification } from "./src/feature_notification";
