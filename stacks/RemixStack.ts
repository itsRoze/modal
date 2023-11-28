import { RemixSite, use, type StackContext } from "sst/constructs";

import { Dns } from "./Dns";
import { Secrets } from "./Secrets";

export function RemixStack({ app, stack }: StackContext) {
  const dns = use(Dns);
  const { database, stripe, resend, upstash } = use(Secrets);
  const site = new RemixSite(stack, "site", {
    path: "apps/frontend",
    customDomain: dns.domain,
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
    SiteUrl: site.url || "https://localhost:3000",
  });
}
