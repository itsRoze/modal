import { auth } from "@modal/auth";
import { User } from "@modal/db";
import { z } from "zod";

import { APIError } from "./utils/APIError";
import { ApiZod } from "./utils/ApiZod";

export * as AuthAPI from "./auth";

export const getSession = ApiZod(
  z.object({ request: z.custom<Request>() }),
  async (input) => {
    const { request } = input;
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();
    return session;
  },
);

export const issueLoginToken = ApiZod(
  User.Info.pick({ email: true }),
  async (input) => {
    const { email } = input;
    const user = await User.fromEmail(email);

    if (!user) {
      throw new APIError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    return { email, token: 123455 };
  },
);
