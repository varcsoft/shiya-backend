import { env } from "../../config/env.js";

const welcomeEmail = ({ firstName }) => {
  const logoUrl = env.EMAIL_LOGO_URL
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${env.APP_NAME}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #efefef;
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
      background-color: #ffffff;
      padding: 24px 16px;
      text-align: center;
    }

    .logo {
      width: 72px;
      height: auto;
      margin-bottom: 10px;
    }

    .brand-name {
      font-size: 26px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #f3c6a6;
    }

    .tagline {
      font-size: 11px;
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
      color: #c98a6f;
      font-weight: 600;
    }

    .cta-button {
      display: inline-block;
      margin-top: 10px;
      background-color: #ffffff;
      color: #ffffff !important;
      padding: 10px 22px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.5px;
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
          alt="${env.APP_NAME} Logo"
          class="logo"
        />
        <div class="brand-name">${env.APP_NAME}</div>
      </div>
      <div class="content">
        <p>Hi <span class="highlight">${firstName}</span>,</p>
        <p>Welcome to <strong>${env.APP_NAME}</strong>.</p>
        <p>
          You are now part of a house of fine pieces crafted to celebrate
          the moments that matter most.
        </p>
        <p>
          Explore curated collections, discover timeless pieces, and find pieces
          that feel made just for you.
        </p>
        <p>
          We are excited to be a small part of your story.
        </p>
      </div>
      <div class="content" style="padding-top: 0; padding-bottom: 16px; text-align: center;">
        <a
          href="${env.FRONTEND_URL || env.API_URL}"
          class="cta-button"
          target="_blank"
        >
          Start exploring
        </a>
      </div>
      <div class="footer">
        <div>With warmth,</div>
        <div><strong>${env.APP_NAME} Team</strong></div>
        <div style="margin-top: 8px;">
          Need help? Email us at
          <a href="mailto:${env.REFLECT_SMTP_REPLY_TO}">${env.REFLECT_SMTP_REPLY_TO}</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export default welcomeEmail;
