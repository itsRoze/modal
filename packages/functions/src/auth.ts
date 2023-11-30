import { auth } from "@modal/auth";
import { User } from "@modal/db";
import { z } from "zod";

import { APIError } from "./utils/APIError";
import { zod } from "./utils/zod";

export * as AuthAPI from "./auth";

export const isLoggedIn = zod(
  z.object({ request: z.custom<Request>() }),
  async (input) => {
    const { request } = input;
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();
    return session ? true : false;
  },
);

export const issueLoginToken = zod(
  User.Info.pick({ email: true }),
  async (input) => {
    const { email } = input;
    const user = await User.fromEmail(email);

    console.log("USER", user);
    if (!user) {
      console.log("in here");
      return new APIError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    return { email, token: 123455 };

    // const user = User.fromEmail(email);
    //
    //
    // throw new Error("Not implemented");
  },
);
