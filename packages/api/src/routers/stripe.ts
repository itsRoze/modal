import { getOrCreateStripeCustomerIdForUser } from "@modal/stripe";
import { TRPCError } from "@trpc/server";
import { Config } from "sst/node/config";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, db, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      db,
      stripe,
      userId: session.userId,
    });

    if (!customerId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create customer",
      });
    }
    const baseUrl = `http://${req.headers.host ?? "localhost:3000"}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: session.userId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: Config.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/app/account?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/app/account?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: session.userId,
        },
      },
    });

    if (!checkoutSession) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create checkout session",
      });
    }

    return { checkoutUrl: checkoutSession.url };
  }),

  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, db, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      db,
      stripe,
      userId: session.userId,
    });

    if (!customerId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create customer",
      });
    }

    const baseUrl = `http://${req.headers.host ?? "localhost:3000"}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/app/account`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});
