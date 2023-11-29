import { type StackContext } from "sst/constructs";

export function Dns({ stack }: StackContext) {
  const rootDomain = "usemodal.com";

  if (stack.stage === "prod") {
    return {
      appDomain: "app.usemodal.com",
      commercialDomain: rootDomain,
      hostedZone: rootDomain,
    };
  }

  if (stack.stage === "dev") {
    return {
      appDomain: "dev.app.usemodal.com",
      commercialDomain: "dev.usemodal.com",
      hostedZone: rootDomain,
    };
  }

  return undefined;
}
