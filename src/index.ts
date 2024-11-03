import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Congrats! You've deployed Hono to Vercel" });
});

export { app };
