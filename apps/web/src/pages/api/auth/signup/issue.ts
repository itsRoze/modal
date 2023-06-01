import { type NextApiRequest, type NextApiResponse } from "next";
import { otpToken } from "@modal/auth";
import { create } from "@modal/db/src/user";
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
    console.log("before");
    const user = await create({ email });
    console.log("after");

    if (!user) throw new Error("User not created");

    const otp = await otpToken.issue(user.userId);
    console.log(otp);

    res.status(200).json({ message: "OTP sent", userId: user.userId });
  } catch (error) {
    if (error instanceof LuciaError) {
      let errorMsg;
      switch (error.message) {
        case "AUTH_DUPLICATE_KEY_ID":
          errorMsg = "Email is already registered";
          break;

        default:
          errorMsg = "Unknown error occurred";
          break;
      }
      res.status(400).json({ error: errorMsg });
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
