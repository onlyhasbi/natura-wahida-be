import { Static, t } from "elysia";
import { insertPatients } from "../../db/schema";

export const PatientsRequestValidationSchema = t.Object({
  full_name: t.String({ minLength: 3 }),
  birth_place: t.String({ minLength: 1 }),
  birthdate: t.String({ minLength: 1 }),
  address: t.String({ minLength: 1 }),
  religion: t.String({ minLength: 1 }),
  job: t.String({ minLength: 1 }),
  married: t.Enum({
    menikah: "menikah",
    janda: "janda",
    duda: "duda",
    belum_nikah: "belum menikah",
  }),
  phone_number: t.String({ minLength: 5 }),
});

export const PatientsUpdateRequestValidationSchema = t.Partial(
  PatientsRequestValidationSchema
);

export type PayloadAddPatient = Static<typeof insertPatients>;
export type PayloadUpdatePatient = Partial<Static<typeof insertPatients>>;
