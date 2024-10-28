import { Hono } from "hono";
import db from "../db";
import { findOne } from "../utils/findOne";

const users = new Hono().basePath("/users");

users.get("/", async (c) => {
  const { data } = await db.from("users").select("*");
  return c.json({
    data,
    count: data?.length ?? 0,
  });
});

users.get("/:id", async (c) => {
  const { id } = c.req.param();
  const { data, error, count } = await findOne("users", id);
  console.log({ data, error, count });
  return c.json(error ? { message: "no data found" } : { data });
});

users.delete("/:id", async (c) => {
  const { id } = c.req.param();

  let message = "deleted failed. user not found";
  const deleted = await db
    .from("users")
    .delete({ count: "exact" })
    .eq("id", id)
    .select("username");

  if (deleted.count) {
    message = `user ${deleted.data?.[0].username} deleted successfully`;
  }

  return c.json({
    message,
  });
});

users.post("/", async (c) => {
  const body = await c.req.json();
  const { data, error } = await db.from("users").insert(body).select();

  let message = "inserted failed. check your payload";
  if (!error) {
    message = "data was added successfully";
  }

  return c.json({
    data: data?.[0],
    message,
  });
});

export default users;
