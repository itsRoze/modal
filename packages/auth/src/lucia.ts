import { planetscale } from "@lucia-auth/adapter-mysql";
import { connect } from "@planetscale/database";
import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import { Config } from "sst/node/config";

const env = process.env.NODE_ENV === "development" ? "DEV" : "PROD";

export const connection = connect({
  host: Config.DB_HOST,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
});

export const auth = lucia({
  adapter: planetscale(connection),
  env,
  middleware: node(),
  transformDatabaseUser: (userData) => ({
    userId: userData.id,
    email: userData.email,
    time_email_verified: userData.time_email_verified,
  }),
});

export type Auth = typeof auth;
