import { Api } from "@modal/functions";
import { redirect } from "@remix-run/node";

export default async function redirectIfLoggedIn(request: Request) {
  const session = await Api.Auth.getSession({ request });
  if (session) return redirect(process.env.APP_URL ?? "/");
  return null;
}
