import { type db } from "@modal/db";
import { User, fromId } from "@modal/db/src/user";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  db,
  userId,
}: {
  stripe: Stripe;
  db: db;
  userId: string;
}) => {
  let user = await fromId(userId);
  if (!user) throw new Error("User not found");
  if (user.stripeCustomerId) return user.stripeCustomerId;

  // create a new customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  });

  // update with new customer id
  await db
    .update(User.user)
    .set({ stripeCustomerId: customer.id })
    .where(eq(User.user.id, userId));

  // return user
  user = await fromId(userId);
  if (!user) throw new Error("User not found");
  if (!user.stripeCustomerId)
    throw new Error("Failed to create Stripe customer");
  return user.stripeCustomerId;
};

export const handleInvoicePaid = async ({
  event,
  stripe,
  db,
}: {
  event: Stripe.Event;
  stripe: Stripe;
  db: db;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string,
  );
  const userId = subscription.metadata.userId;
  if (!userId) throw new Error("User subscription not found");

  // update user with subscription data
  await db
    .update(User.user)
    .set({
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    })
    .where(eq(User.user.id, userId));
};

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  db,
}: {
  event: Stripe.Event;
  db: db;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;
  if (!userId) throw new Error("User subscription not found");

  // update user with subscription data
  await db
    .update(User.user)
    .set({
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    })
    .where(eq(User.user.id, userId));
};

export const handleSubscriptionCanceled = async ({
  event,
  db,
}: {
  event: Stripe.Event;
  db: db;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;
  if (!userId) throw new Error("User subscription not found");

  // remove subscription data from user
  await db
    .update(User.user)
    .set({
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null,
    })
    .where(eq(User.user.id, userId));
};
