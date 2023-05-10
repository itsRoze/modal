import type { StackContext } from "sst/constructs";
import { NextjsSite } from "sst/constructs";

export function WebStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
