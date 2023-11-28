import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./src/trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello!" };
  }),
  echo: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    const { user } = ctx;
    return { message: `you said ${input}`, user };
  }),
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
