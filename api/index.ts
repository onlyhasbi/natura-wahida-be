import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { routes } from "./routes";

const app = new Hono().basePath("/api");

// Apply middleware
app.use(cors());
app.use(logger());
app.use(prettyJSON());

// Define routes
app.route("/", routes);

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
