import { Static, t } from "elysia";
import { selectTherapists, insertTherapists } from "../../db/schema";

export const TherapistsRequestValidationSchema = t.Object({
  fullname: t.String({ minLength: 3, maxLength: 100 }),
  phone_number: t.String({ minLength: 5 }),
  email: t.String({
    minLength: 5,
    format: "email",
  }),
  specialty: t.String({ minLength: 3, maxLength: 100 }),
  years_of_experience: t.Number(),
  address: t.String({ minLength: 1 }),
});

export const TherapistsUpdateRequestValidationSchema = t.Partial(
  TherapistsRequestValidationSchema
);

export type therapists = Static<typeof selectTherapists>;
export type PayloadAddTherapists = Static<typeof insertTherapists>;
