import { type StackContext } from "sst/constructs";

export function Dns({ stack }: StackContext) {
  const rootDomain = "usemodal.com";
  if (stack.stage === "prod") {
    return { domain: "app.usemodal.com", hostedZone: rootDomain };
  }

  if (stack.stage === "dev") {
    return { domain: "dev.app.usemodal.com", hostedZone: rootDomain };
  }

  return undefined;
}
