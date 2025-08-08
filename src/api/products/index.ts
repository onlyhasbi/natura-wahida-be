import Elysia, { t } from "elysia";
import { message } from "../../common/constant";
import {
  addProducts,
  deleteProduct,
  getProduct,
  getProducts,
  updateProducts,
} from "./services";
import {
  ProductsRequestValidationSchema,
  ProductsUpdateRequestValidationSchema,
} from "./schema";

const defaultTag = {
  detail: {
    tags: ["Products"],
  },
};

export const products = new Elysia().group("/products", (app) =>
  app
    .post(
      "",
      async ({ status, body }) => {
        addProducts(body);
        return status(200, message("Save", "Product"));
      },
      {
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: ProductsRequestValidationSchema,
        ...defaultTag,
      }
    )
    .get("", async ({ status }) => status(200, { data: await getProducts() }), {
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
          return status(400, message("NoId", "Product"));
        }
        const found = await getProduct(Number(id));
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
          return status(400, message("NoId", "Product"));
        }
        const found = await getProducts(+id);
        if (!found) {
          return status(404, message("NotFound", "Product"));
        }
        updateProducts({ id: Number(id), ...body });
        return status(200, message("Update", "Product"));
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
        body: ProductsUpdateRequestValidationSchema,
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
          return status(400, message("NoId", "Product"));
        }
        const deletedUser = deleteProduct(Number(id));
        if (!deletedUser) {
          return status(404, message("NotFound", "Product"));
        }
        return status(200, message("Delete", "Product"));
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
