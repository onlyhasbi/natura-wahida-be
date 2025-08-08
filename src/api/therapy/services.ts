import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { therapy } from "../../db/schema";
import { PayloadAddTherapy, PayloadUpdateTherapy } from "./schema";

export const addTherapy = (payload: PayloadAddTherapy) =>
  db.insert(therapy).values(payload).returning().get();

export const updateTherapy = ({ id, ...rest }: PayloadUpdateTherapy) =>
  db.update(therapy).set(rest).where(eq(therapy.id, id!)).returning().get();

export const deleteTherapy = (id: number) =>
  db.delete(therapy).where(eq(therapy.id, id)).returning().get();

export const getTherapys = (page?: number, pageSize?: number) =>
  db.query.therapy.findMany().execute();

export const getTherapy = (id: number) =>
  db.query.therapy.findFirst({ where: eq(therapy.id, id) }).execute();
