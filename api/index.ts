import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "Hello" }, 200);
});

export default handle(app);
