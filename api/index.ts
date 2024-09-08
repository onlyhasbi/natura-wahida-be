import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { PageConfig } from 'next'

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}
const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello" }, 200);
});

export default handle(app);
