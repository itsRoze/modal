import { type SSTConfig } from "sst";
import { WebStack } from "./stacks/WebStack";
import { Secrets } from "./stacks/Secrets";

export default {
  config(_input) {
    return {
      name: "modal",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Secrets).stack(WebStack);
  },
} satisfies SSTConfig;
