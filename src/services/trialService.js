import appConfig from "../config/app.js";
import { sendEmail } from "../config/reflectMail.js";
import resetPasswordEmail from "../templates/mail/resetPasswordEmail.js";

const data = "";

await sendEmail({
  from: appConfig.authEmail,
  to: "varcsoft@gmail.com",
  replyTo: appConfig.replyTo,
  subject: "Reset Password Request",
  html: resetPasswordEmail({
    firstName: "Venky",
    resetLink: "https://shiya.in/reset-password",
    expiresInMinutes: 30,
  }),
});

export default data;
