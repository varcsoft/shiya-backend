import nodemailer from "nodemailer";
import { env } from "../config/env.js";
const transporter = nodemailer.createTransport({
  host: env.REFLECT_SMTP_HOST,
  port: env.REFLECT_SMTP_PORT,
  from: env.REFLECT_SMTP_FROM,
  auth: {
    user: env.REFLECT_SMTP_USERNAME,
    pass: env.REFLECT_SMTP_PASSWORD,
  },
});
await transporter.verify().then(() => {
  console.log("Transporter verified");
});
export default transporter;
