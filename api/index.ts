import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "Hello" }, 200);
});

export default app;
