import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { counters } from "./schema";
import { eq, sql } from "drizzle-orm";

const connection = connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export const db = drizzle(connection);

export async function getCounter(name: string) {
  const result = await db
    .select()
    .from(counters)
    .where(eq(counters.counter, name));

  if (result.length < 1) {
    throw new Error(`No results found for counter ${name}`);
  }

  return result[0];
}

export async function increaseCounter(name: string) {
  await db
    .update(counters)
    .set({
      tally: sql`${counters.tally}
            + 1`,
    })
    .where(eq(counters.counter, name));
}
