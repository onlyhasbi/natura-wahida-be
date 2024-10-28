import patient from "./patient";
import users from "./users";
import visitor from "./visitor";

import { Hono } from "hono";

const routes = new Hono();
routes.route("/", patient);
routes.route("/", users);
routes.route("/", visitor);

export default routes;
