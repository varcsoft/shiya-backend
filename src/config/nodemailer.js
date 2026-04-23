import nodemailer from "nodemailer";
import { env } from "./env.js";
import { welcomeEmail } from "../templates/mail/index.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});
transporter
  .verify()
  .then(() => {
    console.log("Mail Server is ready to take our messages");
  })
  .catch((err) => {
    console.log("Mail Server is not ready to take our messages", err);
  });
const sendMail = async (options) => {
  try {
    await transporter
      .sendMail({
        from: env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        // text: options.text,
        html: options.html,
      })
      .then((info) => {
        console.log("Email sent: " + info.response);
      })
      .catch((err) => {
        console.log("Error in nodemailer", err);
      });
  } catch (error) {
    console.log("Error in sendMail", error);
  }
};
// sendMail(
//   {
//     to: "venkateshdonthula@varcsoft.com",
//     subject: "Welcome to Devskarma",
//     html: welcomeEmail({ firstName: "Venky" }),
//   }
// )

export { sendMail };

export default transporter;
