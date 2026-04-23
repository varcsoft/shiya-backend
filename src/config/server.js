import { env } from "./env.js";
import logger from "../utils/logger.js";
export const startServer = (app) => {
  app.listen(env.PORT, async () => {
    try {
      // Connect to database
      //   await connectDB();

      logger.info(
        `🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT} can be accessed at http://localhost:${env.PORT}`
      );
      logger.info(
        `📊 Health check available at http://localhost:${env.PORT}/health`
      );
      logger.info(
        `📚 API documentation available at http://localhost:${env.PORT}/api-docs`
      );
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  });
};
