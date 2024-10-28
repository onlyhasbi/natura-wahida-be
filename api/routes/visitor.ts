import { Hono } from "hono";

const visitor = new Hono().basePath("/visitor");

visitor.get("/", (c) => {
  return c.json({
    message: "get visitor",
  });
});

export default visitor;
