import { type NextApiRequest, type NextApiResponse } from "next";
import { auth } from "@modal/auth";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("HELOO FROM API");
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email) {
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href,
        );
        window.localStorage.removeItem("emailForSignIn");
        console.log(result.user);
        res.status(200).json(result.user);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "oops" });
  }
}
