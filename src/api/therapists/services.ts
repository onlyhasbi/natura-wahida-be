import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { therapists } from "../../db/schema";
import { PayloadTherapists } from "./schema";

export const addTherapists = (payload: PayloadTherapists) =>
  db.insert(therapists).values(payload).returning().get();

export const updateTherapists = ({ id, ...rest }: PayloadTherapists) =>
  db
    .update(therapists)
    .set(rest)
    .where(eq(therapists.id, id!))
    .returning()
    .get();

export const deleteTherapists = (id: number) =>
  db.delete(therapists).where(eq(therapists.id, id)).returning().get();

export const getTherapistss = (page?: number, pageSize?: number) =>
  db.query.therapists.findMany().execute();

export const getTherapists = (id: number) =>
  db.query.therapists.findFirst({ where: eq(therapists.id, id) }).execute();
