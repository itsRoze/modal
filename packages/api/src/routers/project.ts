import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { editProjectSchema } from "@modal/common/schemas/project/editSchema";
import { create, fromID, getAll, remove, update } from "@modal/db/src/project";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { ratelimit } from "../ratelimit";
import { redis } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// 5 requests per 5 seconds
const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 s"),
  analytics: true,
});

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      await ratelimit(ratelimiter, userId, "You are creating too fast");
      return await create({
        name: input.name,
        userId,
        spaceId: input.spaceId,
      });
    }),
  update: protectedProcedure
    .input(editProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(ratelimiter, userId, "You are modifying too fast");

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
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;

      await ratelimit(ratelimiter, userId, "You are deleting too fast");

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
      const result = await getAll(input ?? ctx.session.user.userId);
      return result ?? [];
    }),
});
