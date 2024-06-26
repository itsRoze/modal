import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { editSpaceSchema } from "@modal/common/schemas/space/editSchema";
import {
  create,
  fromID,
  fromIdWithProjects,
  getAll,
  getAllWithProjectsQuery,
  remove,
  update,
} from "@modal/db/src/space";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { ratelimit } from "../ratelimit";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type Space = Awaited<ReturnType<typeof getAll>>[number];

export const filterSpaceForClient = (space: Space) => {
  const { id, name } = space;
  return { id, name };
};

// 5 requests per 5 seconds
const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 s"),
  analytics: true,
});

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSpaceSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(
        ratelimiter,
        `spaceCreate-${userId}`,
        "You are creating spaces too fast",
      );

      return await create({ name: input.name, userId: ctx.session.userId });
    }),
  update: protectedProcedure
    .input(editSpaceSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(
        ratelimiter,
        `spaceUpdate-${userId}`,
        "You are modifying spaces too fast",
      );

      await update({ id: input.id, name: input.name });
      const result = await fromID(input.id);
      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Space ${input.id} not found`,
        });

      return result;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(
        ratelimiter,
        `spaceRemove-${userId}`,
        "You are deleting spaces too fast",
      );

      return await remove({ id: input.id });
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
      const result = await fromIdWithProjects(input);
      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Space ${input} not found`,
        });

      return result;
    }),
});
