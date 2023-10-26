import { type NextApiRequest, type NextApiResponse } from "next";
import { auth } from "@modal/auth";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") res.status(404).json({ error: "Not found" });

  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    await auth.invalidateSession(session.sessionId);
    await auth.deleteDeadUserSessions(session.user.userId);
    authRequest.setSession(null);
    res.redirect(302, "/");
  }
}
