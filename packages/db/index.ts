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

export { User } from "./src/user";
// export async function getCounter(name: string) {
//   const result = await db
//     .select()
//     .from(counters)
//     .where(eq(counters.counter, name));
//
//   if (result.length < 1) {
//     throw new Error(`No results found for counter ${name}`);
//   }
//
//   return result[0];
// }
//
// export async function increaseCounter(name: string) {
//   await db
//     .update(counters)
//     .set({
//       tally: sql`${counters.tally}
//             + 1`,
//     })
//     .where(eq(counters.counter, name));
// }
