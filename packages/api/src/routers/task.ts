import { Info, create } from "@modal/db/src/task";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      Info.pick({
        name: true,
        deadline: true,
        priority: true,
        completedTime: true,
        listType: true,
        listId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await create({ ...input, userId: ctx.session.userId });
    }),
});
