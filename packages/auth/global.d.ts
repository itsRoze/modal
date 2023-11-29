/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/lucia.js").Auth;
  type DatabaseUserAttributes = {
    email: string;
    time_email_verified?: string;
  };
  type DatabaseSessionAttributes = object;
}
