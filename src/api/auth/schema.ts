import { Static, t } from "elysia";
import { selectAuth } from "../../db/schema";

export const SigninRequestValidationSchema = t.Object({
  email: t.String({
    minLength: 5,
    format: "email",
  }),
  password: t.String({ minLength: 1 }),
});

export type SigninPayload = Static<typeof SigninRequestValidationSchema>;
export type Auth = Static<typeof selectAuth>;
