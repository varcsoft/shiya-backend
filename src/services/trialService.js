import appConfig from "../config/app.js";
import transporter from "../config/reflectMail.js";
import resetPasswordEmail from "../templates/mail/resetPasswordEmail.js";

const data = "";
const sendEmail = async (email, subject, text) => {
  await transporter.sendMail({
    from: appConfig.salesEmail,
    to: email,
    replyTo: appConfig.replyTo,
    subject: subject,
    text: text,
    html: resetPasswordEmail({
      firstName: "Venky",
      resetLink: "https://shiya.in/reset-password",
      expiresInMinutes: 30,
    }),
  });
};
sendEmail(
  // "techshiya@gmail.com",
  "varcsoft@gmail.com",
  "Order Confirmation",
  "Your order has been confirmed!",
);
export default data;
