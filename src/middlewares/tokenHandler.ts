import { createMiddleware } from "hono/factory";
import { decodeToken, verifyToken } from "../tokenize";
import { handleThrow } from "./throwException";
import { isTokenExpired } from "../utils/common";
import { getAccessToken } from "../services/mysql/token";

export const tokenHandler = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")?.[1] || "";

  if (!token) {
    handleThrow({ type: "unauthorized" });
    return;
  }

  const isAccessTokenExist = (await getAccessToken(token)).length;
  if (!isAccessTokenExist) {
    handleThrow({ type: "unauthorized" });
    return;
  }

  const {
    payload: { exp },
  } = await decodeToken(token);

  const isExpired = !(exp && isTokenExpired(exp));
  if (isExpired) {
    handleThrow({ type: "unauthorized", customMessage: "Token expired" });
    return;
  }

  await next();
});
