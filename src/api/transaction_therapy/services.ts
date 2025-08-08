import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { transactionTherapies } from "../../db/schema";
import {
  PayloadAddTransactionTherapies,
  PayloadUpdateTransactionTherapies,
} from "./schema";

export const addTransactionTherapies = (
  payload: PayloadAddTransactionTherapies
) => db.insert(transactionTherapies).values(payload).returning().get();

export const updateTransactionTherapies = ({
  id,
  ...rest
}: PayloadUpdateTransactionTherapies) =>
  db
    .update(transactionTherapies)
    .set(rest)
    .where(eq(transactionTherapies.id, id!))
    .returning()
    .get();

export const deleteTransactionTherapies = (id: number) =>
  db
    .delete(transactionTherapies)
    .where(eq(transactionTherapies.id, id))
    .returning()
    .get();

export const getTransactionTherapies = (page?: number, pageSize?: number) =>
  db.query.transactionTherapies.findMany().execute();

export const getTransactionTherapie = (id: number) =>
  db.query.transactionTherapies
    .findFirst({ where: eq(transactionTherapies.id, id) })
    .execute();
