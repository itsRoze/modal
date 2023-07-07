import { type Config } from "drizzle-kit";

const connection = {
  user: process.env["SST_Secret_value_DB_USERNAME"],
  password: process.env["SST_Secret_value_DB_PASSWORD"],
  host: process.env["SST_Secret_value_DB_HOST"],
};

export default {
  schema: "./src/**/*.sql.ts",
  out: "./migrations/",
  driver: "mysql2",
  dbCredentials: {
    connectionString: `mysql://${connection.user}:${connection.password}@${connection.host}/modal-db?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config;
