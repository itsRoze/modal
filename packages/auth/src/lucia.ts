import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { node } from "lucia/middleware";
import postgres from "postgres";
import { Config } from "sst/node/config";

const env = process.env.NODE_ENV === "development" ? "DEV" : "PROD";

export const connection = {
  host: Config.DB_HOST,
  user: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
};

const connectionString = `postgresql://${connection.user}:${connection.password}@${connection.host}/neondb?sslmode=require`;
const sqlConnection = postgres(connectionString);

export const auth = lucia({
  adapter: postgresAdapter(sqlConnection, {
    user: "modal_user",
    key: "modal_auth_key",
    session: "modal_auth_session",
  }),
  env,
  middleware: node(),
  getUserAttributes: (userData) => ({
    email: userData.email,
    time_email_verified: userData.time_email_verified,
  }),
});

export type Auth = typeof auth;
