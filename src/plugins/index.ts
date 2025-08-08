import cors from "@elysiajs/cors";
import serverTiming from "@elysiajs/server-timing";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { logger } from "@rasla/logify";
import { helmet } from "elysia-helmet";

export const plugins = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "API Documentation Natura Wahida",
          version: "0.0.1",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        tags: [
          {
            name: "Auth",
            description: "Endpoints related to Authentication",
          },
          {
            name: "Users",
            description: "Endpoints related to Users",
          },
        ],
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(logger())
  .use(helmet())
  .use(
    cors({
      origin: "http://localhost:4000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "authorization"],
    })
  )
  .use(
    serverTiming({
      trace: {
        request: true,
        mapResponse: true,
        total: true,
      },
    })
  );
