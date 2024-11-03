import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import routes from "./routes";

const isDev = process.env.NODE_ENV == "dev";
export const config = isDev
  ? {}
  : {
      runtime: "edge",
    };

const app = new Hono().basePath("/api");

// Apply middleware
app.use(cors());
app.use(logger());
app.use(prettyJSON());

// Define routes
app.route("/", routes);
app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

// Hono configuration for serverless environments
const serve = isDev
  ? {
      port: 4000,
      fetch: app.fetch,
    }
  : handle(app);

export default serve;
