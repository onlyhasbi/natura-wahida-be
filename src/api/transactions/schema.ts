import { Static, t } from "elysia";
import { insertTransactions } from "../../db/schema";

export const TransactionsRequestValidationSchema = t.Object({
  total_amount: t.Number({ minLength: 1 }),
  payment_method: t.Enum({
    tunai: "tunai",
    transfer: "transfer",
  }),
  discount: t.Number(),
  status: t.Enum({ tertunda: "tertunda", selesai: "selesai" }),
  guest_id: t.String(),
});

export const TransactionsUpdateRequestValidationSchema = t.Partial(
  TransactionsRequestValidationSchema
);

export type PayloadAddTransaction = Static<
  typeof TransactionsRequestValidationSchema
>;
export type PayloadUpdateTransaction = Partial<
  Static<typeof insertTransactions>
>;
