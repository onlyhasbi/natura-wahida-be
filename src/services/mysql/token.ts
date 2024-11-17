import { eq } from "drizzle-orm";
import { tokensTable as tokens } from "../../../migrations/tokens";
import { db } from "../../config/mysql";
import { Token } from "../../types/tokens";

export const getAccessToken = async (token: string) =>
  await db.select().from(tokens).where(eq(tokens.access_token, token));

export const getRefreshToken = async (token: string) =>
  await db.select().from(tokens).where(eq(tokens.refresh_token, token));

export const postToken = async (payload: Token) =>
  (await db.insert(tokens).values(payload))?.[0].insertId;

export const putToken = async (payload: Token, refresh_token: string) =>
  await db
    .update(tokens)
    .set(payload)
    .where(eq(tokens.refresh_token, refresh_token));

export const deleteToken = async (token: string) =>
  (await db.delete(tokens).where(eq(tokens.refresh_token, token)))?.[0]
    .affectedRows;

export const refreshToken = async (
  refreshToken: string,
  new_access_token: string
) =>
  (
    await db
      .update(tokens)
      .set({ access_token: new_access_token })
      .where(eq(tokens.refresh_token, refreshToken))
  )?.[0].affectedRows;
