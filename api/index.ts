import { handle } from "@hono/node-server/vercel";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line antfu/no-import-dist
import app from "../dist/src/app.ts";

const isDev = process.env.NODE_ENV == "dev";

export default isDev
  ? {
      port: 4000,
      fetch: app.fetch,
    }
  : handle(app);
