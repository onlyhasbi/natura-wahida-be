import { Elysia } from "elysia";
import { auth } from "./api/auth";
import { patients } from "./api/patients";
import { products } from "./api/products";
import { users } from "./api/users";
import { tokenValidationMiddleware } from "./middleware/tokenValidation";
import { plugins } from "./plugins";
import { therapy } from "./api/therapy";
import { therapists } from "./api/therapists";
import { appointments } from "./api/appointments";
import { prescriptions } from "./api/prescriptions";
import { transactionProducts } from "./api/transaction_product";
import { transactionTherapies } from "./api/transaction_therapy";
import { transactions } from "./api/transactions";
import { prescriptionDetails } from "./api/prescriptions/detail";

let app = new Elysia({ name: "natura-wahida" })
  .use(plugins)
  .use(auth)
  .group("/api", (app) =>
    app
      .use(tokenValidationMiddleware)
      .use(users)
      .use(patients)
      .use(therapy)
      .use(therapists)
      .use(products)
      .use(appointments)
      .use(prescriptions)
      .use(prescriptionDetails)
      .use(transactions)
      .use(transactionProducts)
      .use(transactionTherapies)
  )
  .listen(Bun.env.PORT! || 4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
