import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  addTransactionTherapies,
  deleteTransactionTherapies,
  getTransactionTherapies,
  getTransactionTherapie,
  updateTransactionTherapies,
} from "./services";
import {
  TransactionTherapiesRequestValidationSchema,
  TransactionTherapiesUpdateRequestValidationSchema,
} from "./schema";

const defaultTag = {
  detail: {
    tags: ["Transaction Therapy"],
  },
};

export const transactionTherapies = new Elysia().group(
  "/transaction_therapies",
  (app) =>
    app
      .post(
        "",
        async ({ status, body }) => {
          addTransactionTherapies(body);
          return status(200, message("Save", "Transaction Therapy"));
        },
        {
          security: [
            {
              bearerAuth: [],
            },
          ],
          body: TransactionTherapiesRequestValidationSchema,
          ...defaultTag,
        }
      )
      .get(
        "",
        async ({ status }) =>
          status(200, { data: await getTransactionTherapies() }),
        {
          security: [
            {
              bearerAuth: [],
            },
          ],
          ...defaultTag,
        }
      )
      .get(
        "/:id",
        async ({ status, params: { id } }) => {
          if (isNaN(Number(id))) {
            return status(400, message("NoId", "Transaction Therapy"));
          }
          const found = await getTransactionTherapie(Number(id));
          const data = found ? { data: found } : message("NotFound", "Patient");
          return status(200, data);
        },
        {
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: t.Object({ id: t.String() }),
          ...defaultTag,
        }
      )

      .put(
        "/:id",
        async ({ status, body, params: { id } }) => {
          if (isNaN(Number(id))) {
            return status(400, message("NoId", "Transaction Therapy"));
          }
          const found = await getTransactionTherapies(+id);
          if (!found) {
            return status(404, message("NotFound", "Transaction Therapy"));
          }
          updateTransactionTherapies({ id: Number(id), ...body });
          return status(200, message("Update", "Transaction Therapy"));
        },
        {
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            200: t.Object({ message: t.String() }),
            400: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() }),
          },
          body: TransactionTherapiesUpdateRequestValidationSchema,
          params: t.Object({
            id: t.String(),
          }),
          ...defaultTag,
        }
      )
      .delete(
        "/:id",
        async ({ params: { id }, status }) => {
          if (isNaN(Number(id))) {
            return status(400, message("NoId", "Transaction Therapy"));
          }
          const deletedUser = deleteTransactionTherapies(Number(id));
          if (!deletedUser) {
            return status(404, message("NotFound", "Transaction Therapy"));
          }
          return status(200, message("Delete", "Transaction Therapy"));
        },
        {
          params: t.Object({
            id: t.String({ minLength: 1 }),
          }),
          response: {
            200: t.Object({ message: t.String() }),
            400: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() }),
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
          ...defaultTag,
        }
      )
);
