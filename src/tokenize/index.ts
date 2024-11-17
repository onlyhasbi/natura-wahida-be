import { decode, sign, verify } from "hono/jwt";
import ms from "ms";

export const generateToken = async (
  payload: Record<string, unknown>,
  exp: number
) =>
  await sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
    process.env.SECRET!
  );

export const decodeToken = async (token: string) => await decode(token);

export const verifyToken = async (token: string) =>
  await verify(token, process.env.SECRET!);

export const getToken = async (id: number) => ({
  access_token: await generateToken({ id }, ms("5m")),
  refresh_token: await generateToken({ id }, ms("1d")),
});
