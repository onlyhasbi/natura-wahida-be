import { and, eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { auth, users } from "../../db/schema";
import { Auth } from "./schema";
import { SignupPayload, Users } from "../users/schema";

export const addUser = (payload: SignupPayload) =>
  db.insert(users).values(payload).returning().get();

export const findUserBy = (key: string, value: string) =>
  db.query.users.findFirst({
    where: eq(users[key as keyof Users], value),
  });

export const findAuthBy = (key: string, value: string) =>
  db.query.auth.findFirst({
    where: eq(auth[key as keyof Auth], value),
  });

export const deleteAuth = (token: string) =>
  db.delete(auth).where(eq(auth.access_token, token));

export const addAuth = async (payload: {
  user_id: number;
  access_token: string;
  refresh_token: string;
}) => {
  const _DEV_ = Bun.env.NODE_ENV === "development";
  const isExist = await findAuthBy("user_id", String(payload.user_id));
  if (isExist && _DEV_) {
    await db
      .update(auth)
      .set({
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
      })
      .where(eq(auth.user_id, payload.user_id))
      .execute();
    return;
  }
  await db.insert(auth).values(payload).execute();
};

export const checkToken = (token: string) =>
  db.query.auth.findFirst({ where: eq(auth.access_token, token) }).execute();

export const isTokenExists = async (token: {
  access_token: string;
  refresh_token: string;
}) =>
  await db
    .select()
    .from(auth)
    .where(
      and(
        eq(auth.access_token, token.access_token),
        eq(auth.refresh_token, token.refresh_token)
      )
    );

export const updateAuth = async (token: {
  user_id: number;
  access_token: string;
  refresh_token: string;
}) =>
  db
    .update(auth)
    .set({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    })
    .where(eq(auth.user_id, token.user_id))
    .returning()
    .get();
