import { type NextApiRequest, type NextApiResponse } from "next";
import { auth, otpToken } from "@modal/auth";
import {
  create as createToken,
  deleteByUserId as deleteTokenByUserId,
} from "@modal/db/src/auth_token";
import { fromEmail } from "@modal/db/src/user";
import { sendTokenEmail } from "@modal/email";
import { LuciaError } from "lucia";

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

    // delete previous tokens
    await deleteTokenByUserId(user.id);
    // generate new token
    const otp = otpToken();
    // save token
    await createToken({
      userId: user.id,
      token: otp.token,
      expires: otp.expires,
    });

    console.log(otp);
    await sendTokenEmail({
      token: otp.token,
      userEmail:
        process.env.NODE_ENV === "production" ? email : "elewis9989@gmail.com",
      fromEmail:
        process.env.NODE_ENV === "production"
          ? "support@usemodal.com"
          : "Acme <onboarding@resend.dev>",
    });

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
