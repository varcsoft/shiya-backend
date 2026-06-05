import nodeCron from "node-cron";
import { sendEmail } from "../config/reflectMail.js";
import analyticsEmail from "../templates/mail/analyticsEmail.js";
import { generateAnalytics } from "../services/analytics/index.js";

nodeCron.schedule(
  "0 45 8 * * *",
  async () => {
    console.log("Running analytics job");
    try {
      const analytics = await generateAnalytics();
      const email = analyticsEmail(analytics);
      await sendEmail({
        from: "reports@mail.shiya.in",
        replyTo: "reports@mail.shiya.in",
        to: "techshiya@gmail.com",
        name: "Shiya",
        subject: "Daily Analytics",
        text: "",
        html: email,
        attachments: [],
      });
      console.log("Done");
    } catch (err) {
      console.error(err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  },
);