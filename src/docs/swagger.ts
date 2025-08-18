import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type{ Application } from "express";

const swaggerOptions: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dasvilson API",
      version: "1.0.0",
      description: "API documentation for Dasvilson Server",
    },
    servers: [
      { url: "http://localhost:8000" },
    ],
  },
  apis: ["./src/docs/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
