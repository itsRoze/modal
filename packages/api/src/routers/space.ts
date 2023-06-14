import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { create } from "@modal/db/src/space";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSpaceSchema)
    .mutation(async ({ ctx, input }) => {
      return await create({ name: input.name, userId: ctx.session.userId });
    }),
});
