import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  addTransactions,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransactions,
} from "./services";
import {
  TransactionsRequestValidationSchema,
  TransactionsUpdateRequestValidationSchema,
} from "./schema";

const defaultTag = {
  detail: {
    tags: ["Transaction"],
  },
};

export const transactions = new Elysia().group("/transactions", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addTransactions(body);
        return status(200, message("Save", "Transaction"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: TransactionsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get(
      "",
      async ({ status }) => status(200, { data: await getTransactions() }),
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
          return status(400, message("NoId", "Transaction"));
        }
        const found = await getTransaction(Number(id));
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
          return status(400, message("NoId", "Transaction"));
        }
        const found = await getTransactions(+id);
        if (!found) {
          return status(404, message("NotFound", "Transaction"));
        }
        updateTransactions({ id: Number(id), ...body });
        return status(200, message("Update", "Transaction"));
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
        body: TransactionsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Transaction"));
        }
        const deletedUser = deleteTransaction(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Transaction"));
        }
        return status(200, message("Delete", "Transaction"));
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
