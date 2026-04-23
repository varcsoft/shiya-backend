import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Devskarma API",
      version: "1.0.0",
      description: "Production-grade backend API for Devskarma platform",
      contact: {
        name: "Devskarma Team",
        email: "support@Devskarma.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:6004",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export const SwaggerSpecs = swaggerJsdoc(swaggerOptions);
