import { Config, type StackContext } from "sst/constructs";

export function Secrets(ctx: StackContext) {
  return {
    database: Config.Secret.create(
      ctx.stack,
      "DB_HOST",
      "DB_USERNAME",
      "DB_PASSWORD",
    ),
    stripe: Config.Secret.create(
      ctx.stack,
      "STRIPE_SK",
      "STRIPE_PK",
      "STRIPE_WEBHOOK_SECRET",
      "STRIPE_PRICE_ID",
    ),
  };
}
