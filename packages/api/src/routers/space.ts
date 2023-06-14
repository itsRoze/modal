import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { create, getAllForUserQuery } from "@modal/db/src/space";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSpaceSchema)
    .mutation(async ({ ctx, input }) => {
      return await create({ name: input.name, userId: ctx.session.userId });
    }),
  getAllForUser: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ ctx, input }) => {
      const result = await getAllForUserQuery(input ?? ctx.session.userId);
      return result ?? [];
    }),
});
