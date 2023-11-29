import { connect } from "@planetscale/database";
import { sql } from "drizzle-orm";
import {
  drizzle,
  type PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";
import { Config } from "sst/node/config";

import { dbSchema as schema } from "../..";

async function emptyDBTables(db: PlanetScaleDatabase<typeof schema>) {
  console.log("🗑️ Emptying the entire database");

  const tablesSchema = db._.schema;
  if (!tablesSchema) throw new Error("Schema not loaded");

  const queries = Object.values(tablesSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  console.log("🛜 Sending delete queries");

  await db.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await tx.execute(query);
      }),
    );
  });

  console.log("✅ Database emptied");
}

const connection = connect({
  host: Config.DB_HOST,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
});

const db = drizzle(connection, {
  schema,
});

await emptyDBTables(db);
