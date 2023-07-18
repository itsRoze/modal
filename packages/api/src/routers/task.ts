import {
  Info,
  create,
  getAll,
  getAllForList,
  remove,
  update,
} from "@modal/db/src/task";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      Info.pick({
        name: true,
        deadline: true,
        priority: true,
        listType: true,
        listId: true,
      }).partial({
        deadline: true,
        priority: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await create({ ...input, userId: ctx.session.userId });
    }),
  remove: protectedProcedure
    .input(Info.shape.id)
    .mutation(async ({ input }) => {
      return await remove(input);
    }),
  update: protectedProcedure
    .input(
      Info.pick({
        id: true,
        name: true,
        listId: true,
        listType: true,
        deadline: true,
        completedTime: true,
        priority: true,
      }).partial({
        name: true,
        listId: true,
        listType: true,
        deadline: true,
        completedTime: true,
        priority: true,
      }),
    )
    .mutation(async ({ input }) => {
      return await update(input);
    }),
  getAllForList: protectedProcedure
    .input(Info.pick({ listId: true, listType: true }))
    .query(async ({ input }) => {
      const result = await getAllForList(input);
      return result ?? [];
    }),
  getAllForUser: protectedProcedure
    .input(z.optional(Info.shape.userId))
    .query(async ({ ctx, input }) => {
      const results = await getAll(input ?? ctx.session.userId);
      return results ?? [];
    }),
});
