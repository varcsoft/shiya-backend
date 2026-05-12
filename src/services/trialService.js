import appConfig from "../config/app.js";
import transporter from "../config/reflectMail.js";

const data = "";
const sendEmail = async (email, subject, text) => {
  await transporter.sendMail({
    from: appConfig.salesEmail,
    to: email,
    replyTo: appConfig.replyTo,
    subject: subject,
    text: text,
    html: `<h1>${text}</h1>`,
  });
};
sendEmail(
  // "techshiya@gmail.com",
  "varcsoft@gmail.com",
  "Order Confirmation",
  "Your order has been confirmed!",
);
export default data;
