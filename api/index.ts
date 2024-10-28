import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from 'hono/logger';
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import routes from "./routes";

const isDev = process.env.NODE_ENV == "dev";
export const config = isDev ? {} : { runtime: "edge" };

const app = new Hono();
app.use("/api/*", cors());
app.use(logger())
app.use(prettyJSON());

app.route("/", routes);

// catch all error
// app.onError((err, c) => {});

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

const server = isDev
  ? {
      port: 4000,
      fetch: app.fetch,
    }
  : handle(app);

export default server;
