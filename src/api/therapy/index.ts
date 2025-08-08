import Elysia, { t } from "elysia";
import { message } from "../../common/constant";

import {
  TherapyRequestValidationSchema,
  TherapyUpdateRequestValidationSchema,
} from "./schema";
import {
  addTherapy,
  deleteTherapy,
  getTherapy,
  getTherapys,
  updateTherapy,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Therapy"],
  },
};

export const therapy = new Elysia().group("/therapy", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addTherapy(body);
        return status(200, message("Save", "Therapy"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: TherapyRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get("", async ({ status }) => status(200, { data: await getTherapys() }), {
      security: [
        {
          bearerAuth: [],
        },
      ],
      ...defaultTag,
    })
    .get(
      "/:id",
      async ({ status, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Therapy"));
        }
        const found = await getTherapy(Number(id));
        const data = found ? { data: found } : message("NotFound", "Patient");
        return status(200, data);
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: t.Object({ id: t.String() }),
        ...defaultTag,
      }
    )

    .put(
      "/:id",
      async ({ status, body, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Therapy"));
        }
        const found = await getTherapy(+id);
        if (!found) {
          return status(404, message("NotFound", "Therapy"));
        }
        updateTherapy({ id: Number(id), ...body });
        return status(200, message("Update", "Therapy"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: t.Object({ message: t.String() }),
          400: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
        },
        body: TherapyUpdateRequestValidationSchema,
        params: t.Object({
          id: t.String(),
        }),
        ...defaultTag,
      }
    )
    .delete(
      "/:id",
      async ({ params: { id }, status }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Therapy"));
        }
        const deletedUser = deleteTherapy(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Therapy"));
        }
        return status(200, message("Delete", "Therapy"));
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
