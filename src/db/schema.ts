import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

// users
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 150 }).notNull(),
  email: text("email", { length: 75 }).notNull().unique(),
  password: text("password", { length: 50 }).notNull(),
  gender: text("gender", { enum: ["pria", "wanita"] }).notNull(),
  phone_number: text("phone_number", { length: 20 }),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectUser = createSelectSchema(users);
export const insertUser = createInsertSchema(users);

//auth
export const auth = sqliteTable("auth", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  access_token: text("access_token", { length: 150 }).notNull().unique(),
  refresh_token: text("refresh_token", { length: 150 }).notNull().unique(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectAuth = createSelectSchema(auth);
export const insertAuth = createInsertSchema(auth);

//patients
export const patients = sqliteTable("patients", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  full_name: text("full_name", { length: 150 }).notNull(),
  birth_place: text("birth_place", { length: 100 }).notNull(),
  birthdate: text("birthdate", { length: 50 }).notNull(),
  address: text("address", { length: 255 }).notNull(),
  religion: text("religion", { length: 50 }).notNull(),
  job: text("job", { length: 100 }).notNull(),
  married: text("married", {
    enum: ["menikah", "janda", "duda", "belum menikah"],
  }).notNull(),
  phone_number: text("phone_number", { length: 20 }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectPatients = createSelectSchema(patients);
export const insertPatients = createInsertSchema(patients);

// therapy
export const therapy = sqliteTable("therapy", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 150 }).notNull(),
  cost: real("cost").notNull(),
  status: text("status", { enum: ["0", "1"] }).default("1"),
  description: text("description", { length: 250 }),
});

export const selectTherapy = createSelectSchema(therapy);
export const insertTherapy = createInsertSchema(therapy);

// products
export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 150 }).notNull(),
  description: text("description", { length: 250 }),
  category: text("category"),
  buy_price: real("buy_price").notNull(),
  sell_price: real("sell_price").notNull(),
  discount: real("discount").default(0),
  quantity: integer("quantity"),
  expire_date: text("expire_date", { length: 20 }),
});

export const selectProducts = createSelectSchema(products);
export const insertProducts = createInsertSchema(products);

// therapists
export const therapists = sqliteTable("therapists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullname: text("fullname").notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email"),
  specialty: text("specialty").default("umum"),
  years_of_experience: integer("years_of_experience").notNull(),
  address: text("address"),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectTherapists = createSelectSchema(therapists);
export const insertTherapists = createInsertSchema(therapists);

// prescriptions
export const prescriptions = sqliteTable("prescriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patient_id: integer("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  therapist_id: integer("therapist_id")
    .notNull()
    .references(() => therapists.id, { onDelete: "cascade" }),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectPrescriptions = createSelectSchema(prescriptions);
export const insertPrescriptions = createInsertSchema(prescriptions);

// prescriptionDetails
export const prescriptionDetails = sqliteTable("prescription_details", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    prescription_id: integer("prescription_id")
        .notNull()
        .references(() => prescriptions.id, { onDelete: "cascade" }),
    product_id: integer("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    dosage_instruction: text("dosage_instruction", { length: 255 }).notNull(),
});

export const selectPrescriptionDetails = createSelectSchema(prescriptionDetails);
export const insertPrescriptionDetails = createInsertSchema(prescriptionDetails);

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patient_id: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status", { enum: ["scheduled", "canceled", "completed"] })
    .notNull()
    .default("scheduled"),
  healt_problem: text("healt_problem"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
});

export const selectAppointments = createSelectSchema(appointments);
export const insertAppointments = createInsertSchema(appointments);

// transactions
export const transactions = sqliteTable("transactions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  total_amount: real("total_amount").notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  payment_date: integer("payment_date", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  payment_method: text("payment_method", { enum : ["tunai", "transfer"] }),
  discount: real("discount").default(0),
  status: text("status", { enum: ["selesai", "tertunda"] }),
});

export const selectTransactions = createSelectSchema(transactions);
export const insertTransactions = createInsertSchema(transactions);

// transaction_therapies
export const transactionTherapies = sqliteTable("transaction_therapies", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  transaction_id: integer("transaction_id")
    .references(() => transactions.id)
    .notNull(),
  therapy_id: integer("therapy_id")
    .references(() => therapy.id)
    .notNull(),
  quantity: integer("quantity", { mode: "number" }).notNull(),
});

export const selectTransactionTherapies =
  createSelectSchema(transactionTherapies);
export const insertTransactionTherapies =
  createInsertSchema(transactionTherapies);

// transaction_products
export const transactionProducts = sqliteTable("transaction_products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  transaction_id: integer("transaction_id")
    .references(() => transactions.id)
    .notNull(),
  product_id: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity", { mode: "number" }).notNull(),
});

export const selectTransactionProducts =
  createSelectSchema(transactionProducts);
export const insertTransactionProducts =
  createInsertSchema(transactionProducts);
