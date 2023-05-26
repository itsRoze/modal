import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

import { db } from "../..";
import { useTransaction } from "../utils/transaction";
import { zod } from "../utils/zod";
import { stripeEvent } from "./stripe.sql";

export * as StripeEvent from "./";

export const Info = createSelectSchema(stripeEvent, {
  id: (schema) => schema.id.min(1).max(255),
  api_version: (schema) => schema.api_version,
  data: (schema) => schema.data,
  request: (schema) => schema.request,
  type: (schema) => schema.type.min(1).max(255),
  object: (schema) => schema.object.min(1).max(255),
  account: (schema) => schema.account.min(1).max(255),
  livemode: (schema) => schema.livemode,
  pending_webhooks: (schema) => schema.pending_webhooks,
});

export type Info = z.infer<typeof Info>;

export const create = zod(
  Info.pick({
    id: true,
    api_version: true,
    livemode: true,
    data: true,
    request: true,
    type: true,
    object: true,
    account: true,
    pending_webhooks: true,
  }),
  async (input) => {
    return useTransaction(async (tx) => {
      await tx.insert(stripeEvent).values(input);
      return input.id;
    });
  },
);

export const fromID = zod(Info.shape.id, async (id) =>
  db.transaction(async (tx) => {
    return tx
      .select()
      .from(stripeEvent)
      .where(eq(stripeEvent.id, id))
      .execute()
      .then((rows) => rows[0]);
  }),
);
