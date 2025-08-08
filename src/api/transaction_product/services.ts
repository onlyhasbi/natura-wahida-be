import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { products, transactionProducts } from "../../db/schema";
import {
  PayloadAddTransactionProduct,
  PayloadUpdateTransactionProduct,
} from "./schema";

export const addTransactionProducts = async (
  payload: PayloadAddTransactionProduct
) => {
  const selectedProduct = db
    .select({ quantity: products.quantity })
    .from(products)
    .where(eq(products.id, payload.product_id))
    .get();

  if (
    selectedProduct?.quantity &&
    selectedProduct.quantity > 0 &&
    payload.quantity > 0
  ) {
    db.update(products)
      .set({ quantity: selectedProduct.quantity - payload.quantity })
      .where(eq(products.id, payload.product_id))
      .execute();
  }

  return db.insert(transactionProducts).values(payload).returning().get();
};

export const updateTransactionProducts = ({
  id,
  ...rest
}: PayloadUpdateTransactionProduct) =>
  db
    .update(transactionProducts)
    .set(rest)
    .where(eq(transactionProducts.id, id!))
    .returning()
    .get();

export const deleteTransactionProduct = async (id: number) => {
  const selectedProduct = db
    .select({
      product_id: transactionProducts.product_id,
      quantity: transactionProducts.quantity,
    })
    .from(transactionProducts)
    .where(eq(transactionProducts.id, id))
    .get();

  if (!selectedProduct) {
    throw new Error("Transaction product not found.");
  }

  const product = db
    .select({ quantity: products.quantity })
    .from(products)
    .where(eq(products.id, selectedProduct.product_id))
    .get();

  if (!product) {
    throw new Error("Product not found.");
  }

  await db
    .update(products)
    .set({ quantity: (product?.quantity ?? 0) + selectedProduct.quantity })
    .where(eq(products.id, selectedProduct.product_id))
    .execute();

  return await db
    .delete(transactionProducts)
    .where(eq(transactionProducts.id, id))
    .returning()
    .get();
};

export const getTransactionProducts = (page?: number, pageSize?: number) =>
  db.query.transactionProducts.findMany().execute();

export const getTransactionProduct = (id: number) =>
  db.query.transactionProducts
    .findFirst({ where: eq(transactionProducts.id, id) })
    .execute();
