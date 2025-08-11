import { eq } from "drizzle-orm";
import db from "../../../db/connection";
import { prescriptionDetails, prescriptions } from "../../../db/schema";
import {
  PayloadAddPrescriptionDetail,
  PayloadUpdatePrescriptionDetail,
} from "./schema";

export const addPrescriptionDetail = (
  payload: PayloadAddPrescriptionDetail,
  p0?: { prescription_id: string }
) => db.insert(prescriptionDetails).values(payload).returning().get();

export const updatePrescriptionDetail = ({
  id,
  ...rest
}: PayloadUpdatePrescriptionDetail) =>
  db
    .update(prescriptionDetails)
    .set(rest)
    .where(eq(prescriptions.id, id!))
    .returning()
    .get();

export const deletePrescriptionDetail = (id: number) =>
  db
    .delete(prescriptionDetails)
    .where(eq(prescriptions.id, id))
    .returning()
    .get();

export const getPrescriptionDetails = (
  id: number,
  page?: number,
  pageSize?: number
) =>
  db.query.prescriptionDetails
    .findMany({ where: eq(prescriptionDetails.prescription_id, id) })
    .execute();

export const getPrescriptionDetail = (id: number) =>
  db.query.prescriptionDetails
    .findFirst({ where: eq(prescriptionDetails.prescription_id, id) })
    .execute();
