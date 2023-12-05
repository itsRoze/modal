import { User, db } from "@modal/db";

export const getAll = async () => {
  const users = await db.select().from(User.user);
  return users;
};
