import Elysia, { t } from "elysia";
import { deleteUser, getUsers } from "./services";
import { message } from "../../common/constant";

const defaultTag = {
  detail: {
    tags: ["Users"],
  },
};

export const users = new Elysia().group("/users", (app) =>
  app
    .get(
      "",
      async ({ status }) => {
        return status(200, { data: await getUsers() });
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        ...defaultTag,
      }
    )
    .delete(
      "/:id",
      async ({ params: { id }, status }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "User"));
        }
        const deletedUser = await deleteUser(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "User"));
        }
        return status(200, message("Delete", "User"));
      },
      {
        params: t.Object({
          id: t.String({ minLength: 1 }),
        }),
        response: {
          200: t.Object({ message: t.String() }),
          400: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        ...defaultTag,
      }
    )
);
