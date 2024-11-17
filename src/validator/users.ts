import { z } from "zod";
import { User } from "../types/users";

export const userSchema = z.object({
  first_name: z
    .string({ required_error: "First name is required." })
    .min(3, "First name must be at least 3 character long.")
    .max(100, "First name must be at most 100 characters long."),
  last_name: z
    .string({ required_error: "Last name is required." })
    .max(100, "Last name must be at most 100 characters long."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address.")
    .max(255, "Email must be at most 255 characters long."),
  username: z
    .string({ required_error: "Username is required." })
    .min(3, "Username must be at least 3 characters long.")
    .max(100, "Username must be at most 100 characters long."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(255, "Password must be at most 255 characters long."),
});

export const validateUserPayload = (payload: User) =>
  userSchema.safeParse(payload);

export const validateUserUpdatePayload = (payload: Partial<User>) =>
  userSchema.partial().safeParse(payload);
