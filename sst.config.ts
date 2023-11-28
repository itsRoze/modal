import { type SSTConfig } from "sst";

import { Dns } from "./stacks/Dns";
import { RemixStack } from "./stacks/RemixStack";
import { Secrets } from "./stacks/Secrets";

export default {
  config(_input) {
    return {
      name: "modal",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Dns).stack(Secrets).stack(RemixStack);
  },
} satisfies SSTConfig;
