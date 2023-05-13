import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getCounter, increaseCounter } from "@modal/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async () => {
    await increaseCounter("hits");
    const counter = await getCounter("hits");
    return {
      count: counter?.tally ?? 0,
    };
  }),
});
