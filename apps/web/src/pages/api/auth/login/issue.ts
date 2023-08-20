import { type NextApiRequest, type NextApiResponse } from "next";
import { redis } from "@modal/api";
import { auth, otpToken } from "@modal/auth";
import {
  create as createToken,
  deleteByUserId as deleteTokenByUserId,
} from "@modal/db/src/auth_token";
import { fromEmail } from "@modal/db/src/user";
import { sendTokenEmail } from "@modal/email";
import { Ratelimit } from "@upstash/ratelimit";
import { LuciaError } from "lucia";

type Data = {
  error?: string;
  message?: string;
  userId?: string;
};

// 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  if (req.method !== "POST") res.status(404).json("Not found");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json("Invalid input");
  }

  res.status(200).json("123");
}
