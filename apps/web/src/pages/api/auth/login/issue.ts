import { type NextApiRequest, type NextApiResponse } from "next";
import { auth, otpToken } from "@modal/auth";
import { fromEmail } from "@modal/db/src/user";
import { LuciaError } from "lucia-auth";

type Data = {
  error?: string;
  message?: string;
  userId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") res.status(404).json({ error: "Not found" });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: "Invalid input",
    });
  }

  try {
    const user = await fromEmail(email);
    if (!user) throw new Error("No user found");
    const key = await auth.useKey("email", email, null);

    const otp = await otpToken.issue(key.userId);
    console.log(otp);

    res.status(200).json({ message: "OTP sent", userId: key.userId });
  } catch (error) {
    if (error instanceof LuciaError) {
      if (error.message === "AUTH_INVALID_KEY_ID")
        res.status(400).json({ error: "No user found" });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      console.log(error);
      res.status(400).json({
        error: "Unknown error occurred",
      });
    }
  }
}