import { Hono } from "hono";

const patient = new Hono().basePath("/patients");

patient.get("/", (c) => {
  return c.json({
    message: "get all patient",
  });
});

patient.get("/:id", (c) => {
  const { id } = c.req.param();

  let message = "Guest";
  if (id === "123") {
    message = "Hasbi";
  }

  return c.json({
    message,
  });
});

patient.post("/", async (c) => {
  const { req } = c;

  const data = {
    data: await req.json(),
    message: "patient added",
  };

  console.log(data);
  return c.json(data);
});

export { patient };
