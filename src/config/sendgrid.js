import sgMail from "@sendgrid/mail";
import { env } from "../config/env.js";

sgMail.setApiKey(env.SENDGRID_API_KEY);

const sendEmail = (to, subject, text, html) => {
  const msg = {
    name: "Siri Jewelz",
    to, // Change to your recipient
    from : "sales@sirijewelz.com", // Change to your verified sender
    subject,
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.log("Error sending email:", error.response.body);
    });
};

export default sendEmail;
