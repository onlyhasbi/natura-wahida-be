import { Static, t } from "elysia";
import { insertTransactionProducts } from "../../db/schema";

export const TransactionProductsRequestValidationSchema = t.Object({
  transaction_id: t.Number({ minLength: 1 }),
  product_id: t.Number(),
  quantity: t.Number(),
});

export const TransactionProductsUpdateRequestValidationSchema = t.Partial(
  TransactionProductsRequestValidationSchema
);

export type PayloadAddTransactionProduct = Static<
  typeof TransactionProductsRequestValidationSchema
>;
export type PayloadUpdateTransactionProduct = Partial<
  Static<typeof insertTransactionProducts>
>;
