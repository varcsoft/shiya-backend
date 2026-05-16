import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

const RAZORPAY_MODE = process.env.MODE_RAZORPAY || "TEST";
const DELHIVERY_MODE = process.env.MODE_DELHIVERY || "TEST";
export const env = {
  APP_NAME: process.env.APP_NAME,

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,

  S3_REGION: process.env.S3_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

  PORT: process.env.PORT,

  NODE_ENV: process.env.NODE_ENV || "development",
  API_URL: process.env.API_URL || "http://localhost:3000",

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_SECRET_PASSWORD: process.env.JWT_SECRET_PASSWORD,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Firebase Configuration
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  FRONTEND_URL: process.env.FRONTEND_URL,
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,

  // Razorpay Configuration
  RAZORPAY_KEY_ID:
    RAZORPAY_MODE === "TEST"
      ? process.env.RAZORPAY_KEY_ID_TEST
      : process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET:
    RAZORPAY_MODE === "TEST"
      ? process.env.RAZORPAY_KEY_SECRET_TEST
      : process.env.RAZORPAY_KEY_SECRET,

  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  EMAIL_LOGO_URL: process.env.EMAIL_LOGO_URL,

  // Delhivery Configuration
  DELHIVERY_BASE_URL:
    DELHIVERY_MODE === "TEST"
      ? process.env.DELHIVERY_API_URL_TEST
      : process.env.DELHIVERY_API_URL,

  DELHIVERY_TOKEN:
    DELHIVERY_MODE === "TEST"
      ? process.env.DELHIVERY_TOKEN
      : process.env.DELHIVERY_TOKEN,

  DELHIVERY_TIMEOUT_MS: process.env.DELHIVERY_TIMEOUT_MS,

  // Reflect Mail Configuration
  REFLECT_API_URL: process.env.REFLECT_API_URL,
  REFLECT_SMTP_USERNAME: process.env.REFLECT_SMTP_USERNAME,
  REFLECT_SMTP_PASSWORD: process.env.REFLECT_SMTP_PASSWORD,
  REFLECT_SMTP_REPLY_TO: process.env.REFLECT_SMTP_REPLY_TO,
};
