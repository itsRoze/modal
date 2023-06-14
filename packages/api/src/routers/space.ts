import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { create } from "@modal/db/src/space";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSpaceSchema)
    .mutation(async ({ input }) => {
      return await create(input);
    }),
});
