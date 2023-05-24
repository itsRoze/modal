import { Config } from "sst/node/config";
import Stripe from "stripe";

export const stripe = new Stripe(Config.STRIPE_SK, {
  apiVersion: "2022-11-15",
});
