import { RemixSite, use, type StackContext } from "sst/constructs";

import { Dns } from "./Dns";
import { Secrets } from "./Secrets";

export function CommercialStack({ app, stack }: StackContext) {
  const dns = use(Dns);
  const { database, stripe, resend, upstash } = use(Secrets);
  const site = new RemixSite(stack, "commercial-site", {
    path: "apps/commercial",
    customDomain: dns
      ? {
          domainName: dns.commercialDomain,
          hostedZone: dns.hostedZone,
        }
      : undefined,
    environment: {
      NODE_ENV: app.mode === "dev" ? "development" : "production",
      SST_REGION: app.region,
      PORT: "4000",
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
    SiteUrl: site.customDomainUrl || "https://localhost:4000",
  });
}
