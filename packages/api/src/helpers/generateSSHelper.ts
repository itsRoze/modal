import { db } from "@modal/db";
import { stripe } from "@modal/stripe";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { appRouter } from "../root";

export const generateSSHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: {
      db,
      stripe,
      session: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });
