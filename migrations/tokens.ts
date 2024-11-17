import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const tokensTable = mysqlTable("tokens", {
  id: serial("id").primaryKey(),
  access_token: varchar("access_token", { length: 255 }),
  refresh_token: varchar("refresh_token", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
