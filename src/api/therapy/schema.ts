import { Static, t } from "elysia";
import { insertTherapy } from "../../db/schema";

export const TherapyRequestValidationSchema = t.Object({
  name: t.String({ minLength: 3, maxLength: 100 }),
  cost: t.Number(),
  description: t.String({ minLength: 1 }),
});

export const TherapyUpdateRequestValidationSchema = t.Partial(
  TherapyRequestValidationSchema
);

export type PayloadAddTherapy = Static<typeof insertTherapy>;
export type PayloadUpdateTherapy = Partial<Static<typeof insertTherapy>>;
