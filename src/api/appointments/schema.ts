import { Static, t } from "elysia";
import { insertAppointments } from "../../db/schema";

export const AppointmentsRequestValidationSchema = t.Object({
  patient_id: t.Number(),
  date: t.String(),
  time: t.String(),
  status: t.Enum({
    scheduled: "scheduled",
    completed: "completed",
    canceled: "canceled",
  }),
  healt_problem: t.String({ maxLength: 255 }),
});

export const AppointmentsUpdateRequestValidationSchema = t.Partial(
  AppointmentsRequestValidationSchema
);

export type PayloadAddAppointments = Static<typeof insertAppointments>;
export type PayloadUpdateAppointments = Partial<
  Static<typeof insertAppointments>
>;
