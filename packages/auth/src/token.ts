import { passwordToken } from "@lucia-auth/tokens";

import { auth } from "./lucia";

export const otpToken = passwordToken(auth, "otp", {
  expiresIn: 60 * 60, // 1 hour
});
