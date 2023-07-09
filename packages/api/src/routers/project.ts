import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { create, fromID, remove } from "@modal/db/src/project";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await remove({ id: input.id });
    }),
  getProjectInfo: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const result = await fromID(input);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      return result;
    }),
});
