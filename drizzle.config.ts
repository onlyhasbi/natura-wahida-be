import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: Bun.env.DB_SCHEMA!,
  out: "./sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: Bun.env.DB!,
  },
});
