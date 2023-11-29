import { User, db } from "@modal/db";

export * as UserAPI from "./user";
export const get_all = async () => {
  const users = await db.select().from(User.user);
  return users;
};
