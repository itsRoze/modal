import { type NextApiRequest, type NextApiResponse } from "next";
import { StripeEvent, db } from "@modal/db";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
  stripe,
  type Stripe,
} from "@modal/stripe";
import { buffer } from "micro";
import { Config } from "sst/node/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = Config.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event: Stripe.Event = stripe.webhooks.constructEvent(
        buf,
        sig,
        webhookSecret,
      );

      switch (event.type) {
        case "invoice.paid":
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
          await handleInvoicePaid({
            event,
            stripe,
            db,
          });
          break;

        case "checkout.session.completed":
          // Used to provision services as they are added to a subscription.
          await handleCheckoutSessionCompleted({
            event,
            db,
          });
          break;

        case "customer.subscription.updated":
          // Used to provision services as they are updated.
          await handleSubscriptionCreatedOrUpdated({
            event,
            db,
          });
          break;

        case "customer.subscription.deleted":
          // handle subscription cancelled automatically based
          // upon your subscription settings.
          await handleSubscriptionCanceled({
            event,
            db,
          });
          break;

        default:
        // unexpected event type
      }

      // Record the event in the database
      await StripeEvent.create({
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account ?? null,
        data: JSON.stringify({
          object: event.data.object,
          previous_attributes: event.data.previous_attributes,
        }),
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: JSON.stringify({
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        }),
      });

      res.status(200).json({ received: true });
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
