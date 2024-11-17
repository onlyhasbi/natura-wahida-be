import { z } from "zod";
import { usersTable } from "../../migrations/users";
import { signinSchema } from "../validator/auth";

export type User = typeof usersTable.$inferInsert;

export type SignUp = Omit<User, "passwordHash"> & { password: string };
export type SignIn = z.infer<typeof signinSchema>;
