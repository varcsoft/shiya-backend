import express from "express";
import { modernWelcomeEmail } from "../templates/mail/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const payload = {
    firstName: "Venky",
  };
  res.send(modernWelcomeEmail(payload));
});

export default router;
