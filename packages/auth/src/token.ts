import { generateRandomString } from "lucia/utils";

const EXPIRES_IN = 1000 * 60 * 30; // 30 minutes

export const isWithinExpiration = (expiresIn: number) => {
  const currentTime = new Date().getTime();
  return currentTime < expiresIn;
};

// generates new password
export const generateToken = () => {
  const token = generateRandomString(8, "1234567890");
  return {
    token,
    expires: new Date().getTime() + EXPIRES_IN,
  };
};
