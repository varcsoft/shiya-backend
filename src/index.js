import express from "express";
import { initializeFirebase } from "./config/firebase.js";
import { myCors } from "./config/cors.js";
import { startServer } from "./config/server.js";
import { initRoutes } from "./routes/index.js";

try {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  myCors(app);
  initRoutes(app);
  initializeFirebase();
  startServer(app);
} catch (error) {
  console.error("Error starting server:", error);
}
