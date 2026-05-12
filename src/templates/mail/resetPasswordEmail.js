import { env } from "../../config/env.js";

const resetPasswordEmail = ({
  firstName,
  resetLink,
  expiresInMinutes = 30,
}) => {
  const logoUrl = env.EMAIL_LOGO_URL || "https://shiya.in/logo.png";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #222222;
    }

    .wrapper {
      width: 100%;
      background-color: #efefef;
      padding: 24px 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
    }

    .header {
      background-color: #ffffffff;
      padding: 24px 16px;
      text-align: center;
    }

    .logo {
      width: 90px;
      height: auto;
      margin-bottom: 10px;
    }

    .brand-name {
      font-size: 22px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #6e141bff;
    }

    .tagline {
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #f3c6a6;
      margin-top: 6px;
    }

    .content {
      padding: 24px 24px 8px 24px;
      line-height: 1.7;
      color: #333333;
      font-size: 14px;
    }

    .content p {
      margin: 0 0 14px 0;
    }

    .highlight {
      color: #000000f5;
      font-weight: 600;
    }

    .cta-button {
      display: inline-block;
      margin-top: 10px;
      background-color: #000000ea;
      color: #ffffff !important;
      padding: 10px 22px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.5px;
    }

    .notice {
      font-size: 12px;
      color: #777777;
    }

    .footer {
      padding: 18px 24px 22px 24px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background-color: #fafafa;
    }

    .footer a {
      color: #c98a6f;
      text-decoration: none;
    }

    @media (max-width: 600px) {
      .container {
        margin: 0 16px;
      }

      .content {
        padding: 20px 18px 8px 18px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img
          src="${logoUrl}"
          alt="Shiya Logo"
          class="logo"
        />
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${firstName}</span>,</p>
        <p>
          We received a request to reset the password for your
          <strong>${env.APP_NAME}</strong> account.
        </p>
        <p>
          To choose a new password, click the button below.
        </p>
      </div>
      <div class="content" style="padding-top: 0; padding-bottom: 16px; text-align: center;">
        <a
          href="${resetLink}"
          class="cta-button"
          target="_blank"
        >
          Reset password
        </a>
        <p class="notice" style="margin-top: 16px;">
          This link will be active for approximately ${expiresInMinutes} minutes.
        </p>
      </div>
      <div class="content notice" style="padding-top: 0; padding-bottom: 8px;">
        <p>
          If you did not request this, you can safely ignore this email.
          Your existing password will remain unchanged.
        </p>
      </div>
      <div class="footer">
        <div>With warmth,</div>
        <div><strong>${env.APP_NAME} Team</strong></div>
        <div style="margin-top: 8px;">
          Need help? Email us at
          <a href="mailto:${env.SMTP_FROM}">${env.SMTP_FROM}</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export default resetPasswordEmail;
