import { t, Static } from "elysia";
import { selectUser } from "../../db/schema";

export const SignupRequestValidationSchema = t.Object({
  name: t.String({ minLength: 3 }),
  email: t.String({
    minLength: 5,
    format: "email",
  }),
  password: t.String({ minLength: 1 }),
  gender: t.Enum({ pria: "pria", wanita: "wanita" }),
  phone_number: t.String({ minLength: 5 }),
});

export type SignupPayload = Static<typeof SignupRequestValidationSchema>;
export type Users = Static<typeof selectUser>;
