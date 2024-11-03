import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import routes from "../src/routes";

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

export default app;
