import { appRouter, createTRPCContext } from "@modal/api";
import * as Sentry from "@sentry/node";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : ({ error }) => {
          Sentry.captureException(error);
        },
});
