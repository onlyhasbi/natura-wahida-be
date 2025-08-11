import { Static, t } from "elysia";
import {
  insertPrescriptionDetails,
  insertPrescriptions,
} from "../../../db/schema";

export const PrescriptionDetailRequestValidationSchema = t.Object({
  product_id: t.Number(),
  dosage_instruction: t.String(),
});

export const PrescriptionDetailUpdateRequestValidationSchema = t.Partial(
  PrescriptionDetailRequestValidationSchema
);

export type PayloadAddPrescriptionDetail = Static<
  typeof insertPrescriptionDetails
>;
export type PayloadUpdatePrescriptionDetail = Partial<
  Static<typeof insertPrescriptionDetails>
>;
