import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  PrescriptionsRequestValidationSchema,
  PrescriptionsUpdateRequestValidationSchema,
} from "./schema";
import {
  addPrescription,
  deletePrescription,
  getPrescription,
  getPrescriptions,
  updatePrescription,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Prescriptions"],
  },
};

export const prescriptions = new Elysia().group("/prescriptions", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addPrescription(body);
        return status(200, message("Save", "Prescription"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: PrescriptionsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get("", async ({ status }) => status(200, { data: await getPrescriptions() }), {
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
          return status(400, message("NoId", "Prescription"));
        }
        const found = await getPrescription(Number(id));
        const data = found ? { data: found } : message("NotFound", "Prescription");
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
          return status(400, message("NoId", "Prescription"));
        }
        const found = await getPrescription(+id);
        if (!found) {
          return status(404, message("NotFound", "Prescription"));
        }
        updatePrescription({ id: Number(id), ...body });
        return status(200, message("Update", "Prescription"));
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
        body: PrescriptionsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Prescription"));
        }
        const deletedUser = deletePrescription(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Prescription"));
        }
        return status(200, message("Delete", "Prescription"));
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
