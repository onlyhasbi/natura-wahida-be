import Elysia, { t } from "elysia";
import { message } from "../../common/constant";

import {
  AppointmentsRequestValidationSchema,
  AppointmentsUpdateRequestValidationSchema,
} from "./schema";
import {
  addAppointments,
  deleteAppointments,
  getAppointments,
  getAppointmentss,
  updateAppointments,
} from "./services";

const defaultTag = {
  detail: {
    tags: ["Appointments"],
  },
};

export const appointments = new Elysia().group("/appointments", (app) =>
  app
    .post(
      "/",
      async ({ status, body }) => {
        addAppointments(body);
        return status(200, message("Save", "Appointments"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: AppointmentsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get(
      "/",
      async ({ status }) => status(200, { data: await getAppointmentss() }),
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
          return status(400, message("NoId", "Appointments"));
        }
        const found = await getAppointments(Number(id));
        const data = found
          ? { data: found }
          : message("NotFound", "Appointments");
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
          return status(400, message("NoId", "Appointments"));
        }
        const found = await getAppointments(+id);
        if (!found) {
          return status(404, message("NotFound", "Appointments"));
        }
        updateAppointments({ id: Number(id), ...body });
        return status(200, message("Update", "Appointments"));
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
        body: AppointmentsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Appointments"));
        }
        const deletedUser = deleteAppointments(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Appointments"));
        }
        return status(200, message("Delete", "Appointments"));
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
