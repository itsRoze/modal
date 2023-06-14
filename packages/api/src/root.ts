import { exampleRouter } from "./routers/example";
import { spaceRouter } from "./routers/space";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  stripe: stripeRouter,
  space: spaceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
