import { TRPCError } from "@trpc/server";
import { type Ratelimit } from "@upstash/ratelimit";

export const ratelimit = async (
  ratelimiter: Ratelimit,
  id: string,
  message = "Too many requests",
) => {
  const { success } = await ratelimiter.limit(id);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message,
    });
  }
};
