import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@modal/auth";
import { LuciaError } from "lucia-auth";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not found" });

  if (!req.body) {
    return res.status(400).json({
      error: "Invalid input",
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: "Invalid input",
    });
  }

  console.log("RECEIVED EMAIL", email);

  try {
    const user = await auth.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: email,
        password: null,
      },
      attributes: {
        email,
      },
    });

    console.log("ATTEMPTED CREATE");

    if (!user) throw new Error("User not created");

    const session = await auth.createSession(user.userId);
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    res.redirect(302, "/");
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_DUPLICATE_KEY_ID"
    ) {
      res.status(400).json({
        error: "Email already in use",
      });
    }
    // database connection error
    console.error(error);
    res.status(500).json({
      error: "Unknown error occurred",
    });
  }
}
