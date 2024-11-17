import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  status: varchar("status", { length: 10 }).default("active"),
  // role: varchar("role", { length: 10 }).default("user"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});
