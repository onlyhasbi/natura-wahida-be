import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { auth, users } from "../../db/schema";
import { selectedColumn } from "../../common/utils";

export const getUsers = () =>
  db.query.users.findMany({
    columns: selectedColumn([
      "id",
      "name",
      "email",
      "gender",
      "phoneNumber",
      "created_at",
    ]),
  });

export const deleteUser = async (id: number) => {
  const isUserRemoved = db
    .delete(users)
    .where(eq(users.id, id))
    .returning()
    .get();
  const isAuthenticationRemoved = db
    .delete(auth)
    .where(eq(auth.user_id, id))
    .returning()
    .get();
  return isUserRemoved && isAuthenticationRemoved;
};
