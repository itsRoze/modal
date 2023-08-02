import { type NextApiRequest, type NextApiResponse } from "next";
import { auth, isWithinExpiration } from "@modal/auth";
import { dateToMySqlFormat } from "@modal/common";
import { getByUserIdAndToken } from "@modal/db/src/auth_token";
import { LuciaError } from "lucia";

type Data = {
  error?: string;
  message?: string;
};

type RequestBody = {
  email: string;
  userProvidedToken: string;
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "Not found" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { userProvidedToken, userId }: RequestBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!userProvidedToken || !userId) {
    res.status(400).json({
      error: "Invalid input",
    });
  }

  try {
    const otp = await getByUserIdAndToken({
      token: userProvidedToken,
      userId,
    });

    if (!otp) throw new Error("Invalid token");

    // Check expiration
    if (!isWithinExpiration(otp.expires)) {
      throw new Error("Expired token");
    }

    // Update user
    await auth.updateUserAttributes(userId, {
      time_email_verified: dateToMySqlFormat(new Date()),
    });

    const session = await auth.createSession({
      userId: userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

    res.redirect(302, "/app");
  } catch (error) {
    if (error instanceof LuciaError) {
      res.status(400).json({ error: error.message });
      // generate new password and send new email
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
}
