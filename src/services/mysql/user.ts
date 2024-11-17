import { eq } from "drizzle-orm";
import { db } from "../../config/mysql";
import { usersTable as users } from "../../../migrations/users";
import { User } from "../../types/users";

const userSelection = {
  id: users.id,
  first_name: users.first_name,
  last_name: users.last_name,
  email: users.email,
  status: users.status,
  created_at: users.created_at,
};

export const getUsers = async () => {
  return await db.select(userSelection).from(users);
};

export const getUser = async (id: number) => {
  return await db.select(userSelection).from(users).where(eq(users.id, id));
};

export const getUsername = async (username: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.username, username));
};

export const getEmail = async (email: string) => {
  return await db
    .select(userSelection)
    .from(users)
    .where(eq(users.email, email));
};

export const postUser = async (payload: User) => {
  const result = await db.insert(users).values(payload);
  return result?.[0].insertId;
};

export const deleteUser = async (id: number) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result?.[0].affectedRows;
};

export const putUser = async ({
  id,
  payload,
}: {
  id: number;
  payload: User;
}) => {
  const result = await db.update(users).set(payload).where(eq(users.id, id));
  return result?.[0].affectedRows;
};
