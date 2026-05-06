import express from "express";
import { initializeFirebase } from "./config/firebase.js";
import { myCors } from "./config/cors.js";
import { startServer } from "./config/server.js";
import { initRoutes } from "./routes/index.js";

// import seeddb from "./config/seeder.js";
// import { welcomeEmail } from "./templates/mail/index.js";
import trialService from "./services/trialService.js"
import { generateUUID } from "./config/database.js";
// import { generateToken } from "./config/jwt.js";
// seeddb();
console.log(generateUUID());
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
