import type { StackContext } from "sst/constructs";
import { NextjsSite } from "sst/constructs";

export function WebStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
    environment: {
      DATABASE_URL: process.env.DATABASE_URL!,
    },
    buildCommand: "turbo db:generate && next build",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
