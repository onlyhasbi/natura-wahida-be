import Elysia from "elysia";
import { jwtVerify } from "jose";
import { checkToken } from "../api/auth/services";
import { message } from "../common/constant";
import { JOSEError } from "jose/errors";

export const tokenValidationMiddleware = new Elysia({
  name: "token-validation",
})
  .onBeforeHandle(async ({ headers, set }) => {
    const authorization = headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      set.status = 401;
      return message("Unauthorized");
    }
    const token = authorization.substring(7);
    try {
      const secret = new TextEncoder().encode(Bun.env.ACCESS_TOKEN_SECRET!);
      if (!Bun.env.ACCESS_TOKEN_SECRET) {
        set.status = 500;
        return message("InternalServerError");
      }

      await jwtVerify(token, secret);
      const isTokenActive = await checkToken(token);

      if (!isTokenActive) {
        set.status = 401;
        return message("InvalidToken");
      }
    } catch (error) {
      const joseError = error as JOSEError;
      set.status = 401;
      if (joseError.name === "JWTExpired") {
        return message("TokenExpired");
      }
      return message("InvalidToken");
    }
  })
  .as("scoped");
