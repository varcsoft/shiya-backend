import { env } from "../config/env.js";
import axios from "axios";

const relfectApi = axios.create({
  baseURL: env.REFLECT_API_URL,
});

const sendEmail = async ({ from, to, replyTo, subject, html }) => {
  try {
    await relfectApi.post("/channel/email/sendMail", {
      username: env.REFLECT_SMTP_USERNAME,
      key: env.REFLECT_SMTP_PASSWORD,
      name: env.APP_NAME,
      from: from,
      to: to,
      replyTo: replyTo,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendEmail };
