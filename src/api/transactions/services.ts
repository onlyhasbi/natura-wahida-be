import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { transactions } from "../../db/schema";
import { PayloadAddTransaction, PayloadUpdateTransaction } from "./schema";

export const addTransactions = (payload: PayloadAddTransaction) =>
  db.insert(transactions).values(payload).returning().get();

export const updateTransactions = ({ id, ...rest }: PayloadUpdateTransaction) =>
  db
    .update(transactions)
    .set(rest)
    .where(eq(transactions.id, id!))
    .returning()
    .get();

export const deleteTransaction = (id: number) =>
  db.delete(transactions).where(eq(transactions.id, id)).returning().get();

export const getTransactions = (page?: number, pageSize?: number) =>
  db.query.transactions.findMany().execute();

export const getTransaction = (id: number) =>
  db.query.transactions.findFirst({ where: eq(transactions.id, id) }).execute();
