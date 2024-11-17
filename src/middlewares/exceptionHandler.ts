import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const exceptionHandler: MiddlewareHandler = async (err, next) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  await next();
};
