import { type NextApiRequest, type NextApiResponse } from "next";
import { LuciaTokenError } from "@lucia-auth/tokens";
import { auth, otpToken } from "@modal/auth";

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
    console.log("here1");
    const validateToken = await otpToken.validate(token, userId);
    console.log(validateToken);
    console.log("here2");
    if (validateToken) {
      const session = await auth.createSession(userId);
      console.log("here3");

      const authRequest = auth.handleRequest(req, res);
      console.log("here4");

      authRequest.setSession(session);
      console.log("here5");

      res.status(200).json({ message: "Valid token" });
    }
  } catch (error) {
    if (error instanceof LuciaTokenError && error.message === "EXPIRED_TOKEN") {
      res.status(400).json({ error: "Expired token" });
      // generate new password and send new email
    }
    if (error instanceof LuciaTokenError && error.message === "INVALID_TOKEN") {
      res.status(400).json({ error: "Invalid token" });
    }
    console.log(error);
  }
}
