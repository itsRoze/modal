import { projectRouter } from "./routers/project";
import { spaceRouter } from "./routers/space";
import { stripeRouter } from "./routers/stripe";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  stripe: stripeRouter,
  space: spaceRouter,
  project: projectRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
