import { Static, t } from "elysia";
import { insertTransactionTherapies } from "../../db/schema";

export const TransactionTherapiesRequestValidationSchema = t.Object({
  transaction_id: t.Number({ minLength: 1 }),
  therapy_id: t.Number(),
  quantity: t.Number(),
});

export const TransactionTherapiesUpdateRequestValidationSchema = t.Partial(
  TransactionTherapiesRequestValidationSchema
);

export type PayloadAddTransactionTherapies = Static<
  typeof TransactionTherapiesRequestValidationSchema
>;
export type PayloadUpdateTransactionTherapies = Partial<
  Static<typeof insertTransactionTherapies>
>;
