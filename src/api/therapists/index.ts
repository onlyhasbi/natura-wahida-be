import Elysia, { t } from "elysia";
import { message } from "../../common/constant";

import {
  TherapistsRequestValidationSchema,
  TherapistsUpdateRequestValidationSchema,
} from "./schema";
import {
  addTherapists,
  deleteTherapists,
  getTherapists,
  getTherapistss,
  updateTherapists,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Therapists"],
  },
};

export const therapists = new Elysia().group("/therapists", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addTherapists(body);
        return status(200, message("Save", "Therapists"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: TherapistsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get(
      "",
      async ({ status }) => status(200, { data: await getTherapistss() }),
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        ...defaultTag,
      }
    )
    .get(
      "/:id",
      async ({ status, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Therapists"));
        }
        const found = await getTherapists(Number(id));
        const data = found
          ? { data: found }
          : message("NotFound", "Therapists");
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
          return status(400, message("NoId", "Therapists"));
        }
        const found = await getTherapists(+id);
        if (!found) {
          return status(404, message("NotFound", "Therapists"));
        }
        updateTherapists({ id: Number(id), ...body });
        return status(200, message("Update", "Therapists"));
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
        body: TherapistsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Therapists"));
        }
        const deletedUser = deleteTherapists(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Therapists"));
        }
        return status(200, message("Delete", "Therapists"));
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
