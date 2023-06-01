/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("./src/lucia.js").Auth;
  type UserAttributes = {
    email: string;
    email_verified: boolean;
  };
}
