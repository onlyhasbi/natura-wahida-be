import { Hono } from "hono";

const users = new Hono().basePath("/users");

users.get("/", async (c) => {
  return c.json({
    data: { message: "Hello" },
  });
});

users.get("/:id", async (c) => {
  const { id } = c.req.param();
  return c.json({ message: id });
});

users.delete("/:id", async (c) => {
  const { id } = c.req.param();

  return c.json({
    message: id,
  });
});

users.post("/", async (c) => {
  const body = await c.req.json();

  return c.json({
    data: body,
    message: "Posted",
  });
});

export default users;
