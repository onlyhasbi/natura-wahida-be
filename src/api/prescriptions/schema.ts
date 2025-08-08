import { Static, t } from "elysia";
import { insertPrescriptions } from "../../db/schema";

export const PrescriptionsRequestValidationSchema = t.Object({
  patient_id: t.Number(),
  therapist_id: t.Number(),
  products: t.String(),
});

export const PrescriptionsUpdateRequestValidationSchema = t.Partial(
  PrescriptionsRequestValidationSchema
);

export type PayloadAddPrescription = Static<typeof insertPrescriptions>;
export type PayloadUpdatePrescription = Partial<
  Static<typeof insertPrescriptions>
>;
