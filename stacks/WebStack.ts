import { NextjsSite, use, type StackContext } from "sst/constructs";

import { Secrets } from "./Secrets";

export function WebStack({ stack, app }: StackContext) {
  const { database, stripe, resend } = use(Secrets);
  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
    environment: {
      NODE_ENV: app.mode === "dev" ? "development" : "production",
    },
    bind: [
      database.DB_HOST,
      database.DB_USERNAME,
      database.DB_PASSWORD,
      stripe.STRIPE_PK,
      stripe.STRIPE_SK,
      stripe.STRIPE_PRICE_ID,
      stripe.STRIPE_WEBHOOK_SECRET,
      resend.RESEND_API_KEY,
    ],
  });

  stack.addOutputs({
    SiteUrl: site.url || "https://localhost:3000",
  });
}
