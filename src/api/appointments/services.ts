import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { appointments } from "../../db/schema";
import { PayloadAddAppointments, PayloadUpdateAppointments } from "./schema";

export const addAppointments = (payload: PayloadAddAppointments) =>
  db.insert(appointments).values(payload).returning().get();

export const updateAppointments = ({
  id,
  ...rest
}: PayloadUpdateAppointments) =>
  db
    .update(appointments)
    .set(rest)
    .where(eq(appointments.id, id!))
    .returning()
    .get();

export const deleteAppointments = (id: number) =>
  db.delete(appointments).where(eq(appointments.id, id)).returning().get();

export const getAppointmentss = (page?: number, pageSize?: number) =>
  db.query.appointments.findMany().execute();

export const getAppointments = (id: number) =>
  db.query.appointments.findFirst({ where: eq(appointments.id, id) }).execute();
