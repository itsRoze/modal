import { NextjsSite, use, type StackContext } from "sst/constructs";

import { Secrets } from "./Secrets";

export function WebStack({ stack, app }: StackContext) {
  const { database, stripe, resend, upstash } = use(Secrets);
  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
    customDomain: stack.stage === "prod" ? "usemodal.com" : undefined,
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
      upstash.UPSTASH_ENDPOINT,
      upstash.UPSTASH_PASSWORD,
      upstash.UPSTASH_TOKEN,
    ],
  });

  stack.addOutputs({
    SiteUrl:
      app.mode === "dev"
        ? site.url || "https://localhost:3000"
        : site.customDomainUrl || site.url,
  });
}
