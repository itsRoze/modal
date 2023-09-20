import { FeatureNotification } from "@modal/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const featureRouter = createTRPCRouter({
  completeWelcome: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx.session.user;
    await FeatureNotification.updateByUserId({
      userId,
      modalType: "welcome",
      showModal: false,
    });
  }),
});
