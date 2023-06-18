import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { create } from "@modal/db/src/project";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      return await create({
        name: input.name,
        userId: ctx.session.userId,
        spaceId: input.spaceId,
      });
    }),
});
