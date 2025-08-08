import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  addTransactionProducts,
  deleteTransactionProduct,
  getTransactionProduct,
  getTransactionProducts,
  updateTransactionProducts,
} from "./services";
import {
  TransactionProductsRequestValidationSchema,
  TransactionProductsUpdateRequestValidationSchema,
} from "./schema";

const defaultTag = {
  detail: {
    tags: ["Transaction Product"],
  },
};

export const transactionProducts = new Elysia().group("/transaction_product", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addTransactionProducts(body);
        return status(200, message("Save", "Transaction Product"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: TransactionProductsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get("", async ({ status }) => status(200, { data: await getTransactionProducts() }), {
      security: [
        {
          bearerAuth: [],
        },
      ],
      ...defaultTag,
    })
    .get(
      "/:id",
      async ({ status, params: { id } }) => {
        if (isNaN(Number(id))) {
          return status(400, message("NoId", "Transaction Product"));
        }
        const found = await getTransactionProduct(Number(id));
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
          return status(400, message("NoId", "Transaction Product"));
        }
        const found = await getTransactionProducts(+id);
        if (!found) {
          return status(404, message("NotFound", "Transaction Product"));
        }
        updateTransactionProducts({ id: Number(id), ...body });
        return status(200, message("Update", "Transaction Product"));
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
        body: TransactionProductsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Transaction Product"));
        }
        const deletedUser = deleteTransactionProduct(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Transaction Product"));
        }
        return status(200, message("Delete", "Transaction Product"));
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
