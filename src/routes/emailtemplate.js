import express from "express";
import { modernWelcomeEmail } from "../templates/mail/index.js";
import sendEmail from "../config/sendgrid.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const payload = {
    firstName: "Sangeeta",
  };
  res.send(modernWelcomeEmail(payload));
});

export default router;
