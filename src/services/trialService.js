import appConfig from "../config/app.js";
import transporter, { sendEmail } from "../config/reflectMail.js";
import resetPasswordEmail from "../templates/mail/resetPasswordEmail.js";

const data = "";

await sendEmail({
  from: "Shiya <" + appConfig.authEmail + ">",
  to: "varcsoft@gmail.com",
  replyTo: appConfig.replyTo,
  subject: "Reset Password Request",
  text: "Your password reset has been requested!",
  html: resetPasswordEmail({
    firstName: "Venky",
    resetLink: "https://shiya.in/reset-password",
    expiresInMinutes: 30,
  }),
});

export default data;
