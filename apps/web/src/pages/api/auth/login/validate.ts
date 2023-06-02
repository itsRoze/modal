import { type NextApiRequest, type NextApiResponse } from "next";
import { LuciaTokenError } from "@lucia-auth/tokens";
import { auth, otpToken } from "@modal/auth";
import { dateToMySqlFormat } from "@modal/common";

type Data = {
  error?: string;
  message?: string;
};

type RequestBody = {
  token: string;
  userId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") res.status(404).json({ error: "Not found" });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { token, userId }: RequestBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!token || !userId) {
    res.status(400).json({
      error: "Invalid input",
    });
  }

  try {
    const validateToken = await otpToken.validate(token, userId);
    if (validateToken) {
      // In case the user never verified their email, update it now
      await auth.invalidateAllUserSessions(validateToken.userId);
      const user = await auth.getUser(validateToken.userId);
      if (!user.time_email_verified) {
        await auth.updateUserAttributes(validateToken.userId, {
          time_email_verified: dateToMySqlFormat(new Date()),
        });
      }

      // Create a new session
      const session = await auth.createSession(validateToken.userId);
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);

      res.redirect(302, "/app");
    }
  } catch (error) {
    if (error instanceof LuciaTokenError && error.message === "EXPIRED_TOKEN") {
      res.status(400).json({ error: "Expired token" });
      // generate new password and send new email
      const otp = await otpToken.issue(userId);
      console.log(otp);
    } else if (
      error instanceof LuciaTokenError &&
      error.message === "INVALID_TOKEN"
    ) {
      res.status(400).json({ error: "Invalid token" });
    } else {
      console.log(error);
      res.status(400).json({ error: "Something went wrong" });
    }
  }
}