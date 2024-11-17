import { Hono } from "hono";
import { validator } from "hono/validator";
import { handleThrow } from "../../middlewares/throwException";
import {
  deleteUser,
  getUser,
  getUsers,
  putUser,
} from "../../services/mysql/user";
import { User } from "../../types/users";
import {
  validateUserPayload,
  validateUserUpdatePayload,
} from "../../validator/users";
import { tokenHandler } from "../../middlewares/tokenHandler";

const validateParams = validator("param", async (_, c) => {
  const id = c.req.param("id");
  if (id && isNaN(parseInt(id, 10))) {
    handleThrow({
      type: "badRequest",
      customMessage: "Invalid id type. Number required",
    });
    return;
  }
  const found = await getUser(Number(id));
  if (!found.length) {
    handleThrow({ type: "notFound", table: "User" });
  }
  return { param: { id } };
});

export const validatePayload = (type: "post" | "put") =>
  validator("json", async (_, c) => {
    const payload = (await c.req.json()) as User;
    const { success, error, data } =
      type === "post"
        ? validateUserPayload(payload)
        : validateUserUpdatePayload(payload);
    if (!success) {
      handleThrow<typeof error.formErrors.fieldErrors>({
        type: "badRequest",
        error: error.formErrors.fieldErrors,
      });
      return;
    }
    return data;
  });

export const users = new Hono()
  .use(tokenHandler)
  .get("/", async (c) => {
    const data = await getUsers();
    return c.json({ data });
  })
  .get("/:id", validateParams, async (c) => {
    const id = c.req.param("id");
    const user = await getUser(Number(id));
    return c.json({ data: user[0] });
  })
  .put("/:id", validateParams, validatePayload("put"), async (c) => {
    const id = c.req.param("id");
    const payload = (await c.req.json()) as User;
    await putUser({ id: Number(id), payload });
    const data = await getUser(Number(id));
    return c.json({
      data,
      message: "Successfully update the data",
    });
  })
  .delete("/:id", validateParams, async (c) => {
    const id = c.req.param("id");
    await deleteUser(Number(id));
    return c.json({ message: "User deleted successfully" });
  });
