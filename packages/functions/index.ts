import * as AuthAPI from "./src/auth";
import * as UserAPI from "./src/user";

export const Api = {
  User: UserAPI,
  Auth: AuthAPI,
};

export { APIError } from "./src/utils/APIError";
export { getHTTPStatusCodeFromError } from "./src/utils/APIError";
