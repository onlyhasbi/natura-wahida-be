import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtAccessConfig = new Elysia({
  name: "jwtAccessConfig",
}).use(
  jwt({
    name: "jwtAccess",
    secret: Bun.env.ACCESS_TOKEN_SECRET!,
  })
);

export const jwtRefreshConfig = new Elysia({
  name: "jwtRefreshConfig",
}).use(
  jwt({
    name: "jwtRefresh",
    secret: Bun.env.REFRESH_TOKEN_SECRET!,
  })
);
