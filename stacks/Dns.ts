import { type StackContext } from "sst/constructs";

export function Dns({ stack }: StackContext) {
  if (stack.stage === "prod") {
    return { domain: "usemodal.com" };
  }

  if (stack.stage === "dev") {
    return { domain: "dev.usemodal.com" };
  }

  return { domain: undefined };
}
