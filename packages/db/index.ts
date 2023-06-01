import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "sst/node/config";

// import { counters } from "./schema";

export const connection = connect({
  host: Config.DB_HOST,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
});

export const db = drizzle(connection);
export type db = typeof db;

export { User } from "./src/user";
export { StripeEvent } from "./src/stripe_event";
