import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "Hello" }, 200);
});

export default app;
