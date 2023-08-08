import { TRPCError } from "@trpc/server";
import { type Ratelimit } from "@upstash/ratelimit";

export const ratelimit = async (
  ratelimiter: Ratelimit,
  id: string,
  message = "Too many requests",
) => {
  const { success } = await ratelimiter.limit(id);
  if (!success) {
    console.error(`Ratelimit hit for ${id}: `, message);
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message,
    });
  }
};
