import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { env } from "./env.js";
import { welcomeEmail } from "../templates/mail/index.js";

// Create SES client
const ses = new SESv2Client({
  region: "ap-south-1", // change to your region
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

// Create Nodemailer transporte

// Send test email
async function sendEmail() {
  try {
    const command = new SendEmailCommand({
      FromEmailAddress: env.SMTP_FROM, // must be verified in SES
      Destination: {
        // ToAddresses: ["varcsoft@gmail.com"], // required if in sandbox
        ToAddresses: ["sirijewelz9@gmail.com"], // required if in sandbox
      },
      Content: {
        Simple: {
          Subject: {
            Data: "SES Test Email",
          },
          Body: {
            Html: {
              Data: welcomeEmail({
                firstName: "Jayantha Amin",
              }),
            },
          },
        },
      },
    });

    const info = await ses.send(command);

    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
export default sendEmail;
