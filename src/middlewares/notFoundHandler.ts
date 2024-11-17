import { NotFoundHandler } from "hono";
import { BlankEnv } from "hono/types";

export const handlerNotFound: NotFoundHandler<BlankEnv> = (c) =>
  c.json(
    {
      message: "Wrong path. Please check your path",
    },
    400
  );
