import { z } from "zod";
import { SignIn } from "../types/users";

export const signinSchema = z.object({
  username: z.string({ required_error: "Username is required." }),
  password: z.string({ required_error: "Password is required." }),
});

export const validateSigninPayload = (payload: SignIn) =>
  signinSchema.safeParse(payload);
