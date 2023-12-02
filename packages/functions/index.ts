import { AuthAPI } from "./src/auth";
import { UserAPI } from "./src/user";

export const Api = {
  User: UserAPI,
  Auth: AuthAPI,
};

export { APIError } from "./src/utils/APIError";
