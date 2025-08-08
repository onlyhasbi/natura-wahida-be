import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { prescriptions } from "../../db/schema";
import { PayloadAddPrescription, PayloadUpdatePrescription } from "./schema";

export const addPrescription = (payload: PayloadAddPrescription) =>
  db.insert(prescriptions).values(payload).returning().get();

export const updatePrescription = ({ id, ...rest }: PayloadUpdatePrescription) =>
  db.update(prescriptions).set(rest).where(eq(prescriptions.id, id!)).returning().get();

export const deletePrescription = (id: number) =>
  db.delete(prescriptions).where(eq(prescriptions.id, id)).returning().get();

export const getPrescriptions = (page?: number, pageSize?: number) =>
  db.query.prescriptions.findMany().execute();

export const getPrescription = (id: number) =>
  db.query.prescriptions.findFirst({ where: eq(prescriptions.id, id) }).execute();
