import { Redis } from "@upstash/redis";
import { Config } from "sst/node/config";

export const redis = new Redis({
  url: `https://${Config.UPSTASH_ENDPOINT}`,
  token: Config.UPSTASH_TOKEN,
});
