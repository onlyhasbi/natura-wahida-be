import { Static, t } from "elysia";
import { insertProducts } from "../../db/schema";

export const ProductsRequestValidationSchema = t.Object({
  name: t.String({ minLength: 3, maxLength: 150 }),
  description: t.String({ maxLength: 250 }),
  category: t.String({ minLength: 3 }),
  buy_price: t.Number(),
  sell_price: t.Number(),
  discount: t.Number(),
  quantity: t.Number(),
  expire_date: t.String({ maxLength: 20 }),
});

export const ProductsUpdateRequestValidationSchema = t.Partial(
  ProductsRequestValidationSchema
);

export type PayloadAddProduct = Static<typeof ProductsRequestValidationSchema>;
export type PayloadUpdateProduct = Partial<Static<typeof insertProducts>>;
