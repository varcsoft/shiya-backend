import { env } from "../config/env.js";
import response from "../config/response.js";
import crypto from "crypto";
import { decodeToken, verifyToken } from "../config/jwt.js";
import { assignUserRole, getUserById } from "../services/userService.js";
import { roles } from "../config/seeder.js";
import { validateSessionId } from "../services/sessionService.js";
import { sessionType } from "@prisma/client";

/**
 * Middleware to authenticate requests using JWT tokens
 * Supports both Firebase tokens and application JWT tokens
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // console.log("Authenticate Token Middleware");
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return response.sendError(res, 401, 1002);
    }
    // Try to verify as application JWT first
    const verified = verifyToken(token);
    if (!verified) {
      return response.sendError(res, 401, 1004);
    }
    const decoded = decodeToken(token);
    const session = await validateSessionId(
      token,
      decoded.id,
      sessionType.ACCESS,
    );
    if (!session) {
      return response.sendError(res, 401, 1004);
    }
    // Get user from database
    let user = await getUserById(decoded.id);

    // console.log(user)
    if (!user) {
      return response.sendError(res, 401, 1002);
    }
    if (!user.role) {
      user = await assignUserRole(user.id);
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return response.sendError(res, 500, 1003);
  }
};
export const authenticateCookies = async (req, res, next) => {
  try {
    // console.log("Authenticate Cookies Middleware");
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return response.sendError(res, 401, 1002);
    }
    const session = await validateSessionId(
      sessionId,
      req.user.id,
      sessionType.ACCESS,
    );
    if (!session) {
      return response.sendError(res, 401, 1004);
    }
    // Get user from database
    let user = await getUserById(req.user.id);

    // console.log(user)
    if (!user) {
      return response.sendError(res, 401, 1002);
    }
    if (!user.role) {
      user = await assignUserRole(user.id);
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return response.sendError(res, 500, 1003);
  }
};
/**
 * Middleware to check if user has admin privileges
 */
export const requireAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user.role.name != roles.ADMIN) {
    return response.sendError(res, 403, 1005);
  }
  next();
};

export const checkRazorpayWebhook = (req, res, next) => {
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");
  const isValidSignature = expectedSignature === signature;
  req.signatureIsValid = isValidSignature;

  if (!isValidSignature) {
    return response.sendError(res, 400, 4000);
  }
  next();
};

export default {
  authenticateToken,
  requireAdmin,
  checkRazorpayWebhook,
};
