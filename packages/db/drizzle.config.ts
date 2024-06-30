import { defineConfig } from "drizzle-kit";

const connection = {
  user: process.env["SST_Secret_value_DB_USERNAME"],
  password: process.env["SST_Secret_value_DB_PASSWORD"],
  host: process.env["SST_Secret_value_DB_HOST"],
};

const connectionString = `postgresql://${connection.user}:${connection.password}@${connection.host}/neondb?sslmode=require`;

export default defineConfig({
  schema: "./src/**/*.sql.ts",
  out: "./migrations/",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  // tablesFilter: ["modal_*"],
});
