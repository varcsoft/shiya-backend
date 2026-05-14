import { env } from "../../config/env.js";

const modernWelcomeEmail = ({ firstName }) => {
  const logoUrl = env.EMAIL_LOGO_URL || "https://shiya.in/fulllogo.svg";
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
      background-color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #222222;
    }

    .wrapper {
      width: 100%;
      background-color: #efefef;
      padding: 24px 0;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    }

    .hero {
      background: linear-gradient(135deg, #ffffff 0%, #0b887f 40%, #f3c6a6 100%);
      padding: 30px 20px 32px 20px;
      text-align: center;
      color: #ffffff;
    }

    .hero-logo {
      width: 80px;
      height: auto;
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: 26px;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .hero-tagline {
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .hero-text {
      margin-top: 18px;
      font-size: 14px;
      max-width: 420px;
      margin-left: auto;
      margin-right: auto;
    }

    .pill {
      display: inline-block;
      margin-top: 16px;
      padding: 6px 16px;
      border-radius: 999px;
      background-color: rgba(0, 0, 0, 0.16);
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .content {
      padding: 26px 26px 10px 26px;
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

    .list {
      padding-left: 18px;
      margin: 10px 0 18px 0;
    }

    .list li {
      margin-bottom: 6px;
    }

    .cta-section {
      padding: 0 26px 20px 26px;
      text-align: center;
    }

    .cta-button {
      display: inline-block;
      margin-top: 4px;
      background-color: #ffffff;
      color: #ffffff !important;
      padding: 10px 26px;
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

    @media (max-width: 640px) {
      .container {
        margin: 0 16px;
      }

      .content,
      .cta-section {
        padding-left: 18px;
        padding-right: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="hero">
        <img
          src="${logoUrl}"
          alt="${env.APP_NAME} Logo"
          class="hero-logo"
        />
        <div class="hero-title">${env.APP_NAME}</div>
        <div class="hero-text">
          A curated world of fine pieces designed to glow softly today,
          tomorrow and beyond.
        </div>
        <div class="pill">Welcome to ${env.APP_NAME}</div>
      </div>

      <div class="content">
        <p>Hi <span class="highlight">${firstName}</span>,</p>
        <p>
          Thank you for creating your account with <strong>${env.APP_NAME}</strong>.
          Your new profile makes it easier to discover, save and shop pieces
          you love.
        </p>
        <p>With your account you can:</p>
        <ul class="list">
          <li>Save favourites and build your personal wish‑list</li>
          <li>Track orders and view your purchase history</li>
          <li>Receive updates on new collections and limited pieces</li>
        </ul>
        <p>
          We hope every piece you choose becomes a part of your story and
          your everyday shine.
        </p>
      </div>

      <div class="cta-section">
        <a
          href="${env.FRONTEND_URL || env.API_URL}"
          class="cta-button"
          target="_blank"
        >
          Visit your account
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

export default modernWelcomeEmail;
