import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { auth } from "./api/auth";
import { users } from "./api/users";
import { exceptionHandler } from "./middlewares/exceptionHandler";
import { handlerNotFound } from "./middlewares/notFoundHandler";

const app = new Hono()
  .use(cors(), logger(), prettyJSON(), exceptionHandler)
  .notFound(handlerNotFound)
  .route("/", auth)
  .route("/user", users);

export default {
  port: 4000,
  fetch: app.fetch,
};
