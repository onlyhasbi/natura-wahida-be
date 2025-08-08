import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  PatientsRequestValidationSchema,
  PatientsUpdateRequestValidationSchema,
} from "./schema";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Patients"],
  },
};

export const patients = new Elysia().group("/patients", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addPatient(body);
        return status(200, message("Save", "Patient"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: PatientsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get("", async ({ status }) => status(200, { data: await getPatients() }), {
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
          return status(400, message("NoId", "Patient"));
        }
        const found = await getPatient(Number(id));
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
          return status(400, message("NoId", "Patient"));
        }
        const found = await getPatient(+id);
        if (!found) {
          return status(404, message("NotFound", "Patient"));
        }
        updatePatient({ id: Number(id), ...body });
        return status(200, message("Update", "Patient"));
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
        body: PatientsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Patient"));
        }
        const deletedUser = deletePatient(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Patient"));
        }
        return status(200, message("Delete", "Patient"));
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
