import { type SSTConfig } from "sst";

import { CommercialStack } from "./stacks/CommercialStack";
import { Dns } from "./stacks/Dns";
import { Secrets } from "./stacks/Secrets";
import { WebAppStack } from "./stacks/WebAppStack";

export default {
  config(_input) {
    return {
      name: "modal",
      region: "us-east-1",
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(Dns).stack(Secrets).stack(WebAppStack).stack(CommercialStack);
  },
} satisfies SSTConfig;
