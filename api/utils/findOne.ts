import db from "../db";

export const findOne = async (id: string, table: string) =>
  await db.from(table).select("*").eq("id", id).returns();
