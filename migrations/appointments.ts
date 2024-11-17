import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  date,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { usersTable as users } from "./users";

export const appointmentsTable = mysqlTable("appointments", {
  id: serial("id").primaryKey(),
  fullname: varchar("fullname", { length: 250 }).notNull(),
  date: date("schedule").notNull(),
  location: varchar("location", { length: 255 }),
  phone_number: varchar("phone_number", { length: 15 }),
  status: mysqlEnum("status", [
    "BOOKED",
    "CANCELED",
    "CHECKIN",
    "ONPROGRESS",
    "CHECKOUT",
    "DONE",
  ]).notNull(),
  user_id: serial("id").references(() => users.id, {
    onDelete: "set default",
    onUpdate: "set default",
  }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});
