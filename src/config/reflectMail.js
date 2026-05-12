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

const sendEmail = async ({
  from,
  to,
  replyTo,
  subject,
  text,
  html,
  attachments,
  headers,
  email,
}) => {
  await transporter.sendMail({
    from: from,
    to: to,
    replyTo: replyTo,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments
  });
};

await transporter.verify().then(() => {
  console.log("Transporter verified");
});
export { sendEmail };
export default transporter;
