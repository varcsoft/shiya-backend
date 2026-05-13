import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

const SEQUEL_API_MODE = process.env.MODE_SEQUEL_API || "TEST";
const RAZORPAY_MODE = process.env.MODE_RAZORPAY || "TEST";

export const env = {
  APP_NAME: process.env.APP_NAME || "Siri Jewelz",

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

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
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
  // Reflect Mail Configuration
  REFLECT_API_URL: process.env.REFLECT_API_URL,
  REFLECT_SMTP_USERNAME: process.env.REFLECT_SMTP_USERNAME,
  REFLECT_SMTP_PASSWORD: process.env.REFLECT_SMTP_PASSWORD,
};
