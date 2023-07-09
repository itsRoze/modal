import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { editProjectSchema } from "@modal/common/schemas/project/editSchema";
import { create, fromID, getAll, remove, update } from "@modal/db/src/project";
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
  update: protectedProcedure
    .input(editProjectSchema)
    .mutation(async ({ input }) => {
      await update({
        id: input.id,
        name: input.name,
        spaceId: input.spaceId ?? null,
      });
      const result = await fromID(input.id);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      return result;
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
  getAllForUser: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ ctx, input }) => {
      const result = await getAll(input ?? ctx.session.userId);
      return result ?? [];
    }),
});
