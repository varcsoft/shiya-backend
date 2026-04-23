import cors from "cors";
import { env } from "./env.js";
const allowedOrigins = env.ALLOWED_ORIGINS.split(",");
export const myCors = (app) => {
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("Not allowed by CORS:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      // allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.options(/.*/, cors());
};
