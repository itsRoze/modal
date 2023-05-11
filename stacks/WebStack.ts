import type { StackContext } from "sst/constructs";
import { NextjsSite } from "sst/constructs";

export function WebStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
    environment: {
      DATABASE_URL: process.env.DATABASE_URL!,
      DB_HOST: process.env.DB_HOST!,
      DB_USERNAME: process.env.DB_USERNAME!,
      DB_PASSWORD: process.env.DB_PASSWORD!,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
