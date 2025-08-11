import Elysia, { t } from "elysia";
import { message } from "../../../common/constant";
import {
  PrescriptionDetailRequestValidationSchema,
  PrescriptionDetailUpdateRequestValidationSchema,
} from "./schema";
import {
  addPrescriptionDetail,
  deletePrescriptionDetail,
  getPrescriptionDetail,
  getPrescriptionDetails,
  updatePrescriptionDetail,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Prescriptions Detail"],
  },
};

export const prescriptionDetails = new Elysia().group("/prescriptions", (app) =>
  app
    .post(
      "/:id/detail",
      async ({ status, params: { id }, body }) => {
        addPrescriptionDetail({ prescription_id: +id, ...body });
        return status(200, message("Save", "Prescription"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: PrescriptionDetailRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get(
      "/:id/details",
      async ({ status, params: { id } }) =>
        status(200, { data: await getPrescriptionDetails(+id) }),
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
      "/:id/detail",
      async ({ status, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Prescription"));
        }
        const found = await getPrescriptionDetail(Number(id));
        const data = found
          ? { data: found }
          : message("NotFound", "Prescription");
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
      "/:id/detail",
      async ({ status, body, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Prescription"));
        }
        const found = await getPrescriptionDetail(+id);
        if (!found) {
          return status(404, message("NotFound", "Prescription"));
        }
        updatePrescriptionDetail({ id: Number(id), ...body });
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
        body: PrescriptionDetailUpdateRequestValidationSchema,
        params: t.Object({
          id: t.String(),
        }),
        ...defaultTag,
      }
    )
    .delete(
      "/:id/detail",
      async ({ params: { id }, status }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Prescription"));
        }
        const deletedPrescriptionDetail = deletePrescriptionDetail(Number(id));
        if (!deletedPrescriptionDetail) {
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
