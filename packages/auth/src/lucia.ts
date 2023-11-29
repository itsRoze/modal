import { planetscale } from "@lucia-auth/adapter-mysql";
import { connect } from "@planetscale/database";
import { lucia } from "lucia";
import { node } from "lucia/middleware";
import { Config } from "sst/node/config";

const env = process.env.NODE_ENV === "development" ? "DEV" : "PROD";

export const connection = connect({
  host: Config.DB_HOST,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
});

export const auth = lucia({
  adapter: planetscale(connection, {
    user: "user",
    key: "auth_key",
    session: "auth_session",
  }),
  env,
  middleware: node(),
  getUserAttributes: (userData) => ({
    email: userData.email,
    time_email_verified: userData.time_email_verified,
  }),
});

export type Auth = typeof auth;
