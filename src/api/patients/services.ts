import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { patients } from "../../db/schema";
import { PayloadAddPatient, PayloadUpdatePatient } from "./schema";

export const addPatient = (payload: PayloadAddPatient) =>
  db.insert(patients).values(payload).returning().get();

export const updatePatient = ({ id, ...rest }: PayloadUpdatePatient) =>
  db.update(patients).set(rest).where(eq(patients.id, id!)).returning().get();

export const deletePatient = (id: number) =>
  db.delete(patients).where(eq(patients.id, id)).returning().get();

export const getPatients = (page?: number, pageSize?: number) =>
  db.query.patients.findMany().execute();

export const getPatient = (id: number) =>
  db.query.patients.findFirst({ where: eq(patients.id, id) }).execute();
