import { eq } from "drizzle-orm";
import db from "../../db/connection";
import { products } from "../../db/schema";
import { PayloadAddProduct, PayloadUpdateProduct } from "./schema";

export const addProducts = (payload: PayloadAddProduct) =>
  db.insert(products).values(payload).returning().get();

export const updateProducts = ({ id, ...rest }: PayloadUpdateProduct) =>
  db.update(products).set(rest).where(eq(products.id, id!)).returning().get();

export const deleteProduct = (id: number) =>
  db.delete(products).where(eq(products.id, id)).returning().get();

export const getProducts = (page?: number, pageSize?: number) =>
  db.query.products.findMany().execute();

export const getProduct = (id: number) =>
  db.query.products.findFirst({ where: eq(products.id, id) }).execute();
