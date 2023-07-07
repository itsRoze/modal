import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { editSpaceSchema } from "@modal/common/schemas/space/editSchema";
import {
  create,
  fromID,
  getAll,
  getAllWithProjectsQuery,
  update,
} from "@modal/db/src/space";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

type Space = Awaited<ReturnType<typeof getAll>>[number];

export const filterSpaceForClient = (space: Space) => {
  const { id, name } = space;
  return { id, name };
};

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSpaceSchema)
    .mutation(async ({ ctx, input }) => {
      return await create({ name: input.name, userId: ctx.session.userId });
    }),
  update: protectedProcedure
    .input(editSpaceSchema)
    .mutation(async ({ input }) => {
      return await update({ id: input.id, name: input.name });
    }),
  getAllForUser: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ ctx, input }) => {
      const result = await getAllWithProjectsQuery(input ?? ctx.session.userId);
      return result ?? [];
    }),
  getSpacesForUser: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ ctx, input }) => {
      const result = (await getAll(input ?? ctx.session.userId)).map(
        filterSpaceForClient,
      );

      return result ?? [];
    }),
  getSpaceInfo: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const result = await fromID(input);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      return result;
    }),
});
