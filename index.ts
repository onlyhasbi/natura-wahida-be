import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "Hello" }, 200);
});

const port = Bun.env.PORT || 3030;
Bun.serve({ fetch: app.fetch, port });
export default handle(app);
