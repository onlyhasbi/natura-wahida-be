import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { PageConfig } from "next";

const app = new Hono().basePath("/api");
export const config: PageConfig = {
  runtime: "edge",
};

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "Hello" }, 200);
});

const port = Bun.env.PORT || 3030;
Bun.serve({ fetch: app.fetch, port });
export default handle(app);
