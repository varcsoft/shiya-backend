import { createCustomToken, verifyFirebaseToken } from "../config/firebase.js";
import { comparePassword, hashPassword } from "../config/sec.js";
import responseConfig from "../config/response.js";
import { generateResetPasswordToken, generateToken, verifyToken } from "../config/jwt.js";
import { sanitize } from "../config/sanitize.js";
import prisma, { generateUUID } from "../config/database.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../services/userService.js";
import { env } from "../config/env.js";
import { sendEmail } from "../config/reflectMail.js";
import { resetPasswordEmail, welcomeEmail } from "../templates/mail/index.js";
import { createSession } from "../services/sessionService.js";
import { getUserSysDetails } from "../config/requestConfig.js";
import { sessionType } from "@prisma/client";
import crypto from "crypto";
import appConfig from "../config/app.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  const userSysDetails = getUserSysDetails(req);

  if (!user) {
    return responseConfig.sendError(res, 404, 1002, "User not found");
  }

  if (!user.password) {
    if (!user.firebaseUid) {
      return responseConfig.sendError(res, 400, 1101);
    }
    return responseConfig.sendError(res, 400, 1102);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return responseConfig.sendError(res, 401, 1006, "Invalid password");
  }
  const token = generateToken(user);
  const session = await createSession({
    ...userSysDetails,
    userID: user.id,
    token,
    sessionType: sessionType.ACCESS,
  });
  const sanitizedUser = sanitize(user);
  responseConfig.sendSuccess(res, 200, "Login successful", {
    token,
    user: sanitizedUser,
  });
};
const register = async (req, res) => {
  const userSysDetails = getUserSysDetails(req);
  const { email, password } = req.body;
  let user = await getUserByEmail(email);
  if (user) {
    return responseConfig.sendError(res, 400, 1001, "User already exists");
  }
  // checkPassword(password);
  const hashedPassword = await hashPassword(password);
  console.log("hashedPassword", hashedPassword);
  user = await prisma.user.create({
    data: {
      id: generateUUID(),
      ...req.body,
      password: hashedPassword,
    },
  });

  console.log("user", user);
  const token = generateToken(user);
  await createSession({
    ...userSysDetails,
    userID: user.id,
    token,
    sessionType: sessionType.ACCESS,
  });
  const sanitizedUser = sanitize(user);
  await sendEmail(
    user.email,
    `Welcome to ${env.APP_NAME}`,
    "",
    welcomeEmail({ firstName: user.firstName }),
  );
  responseConfig.sendSuccess(res, 201, "User registered successfully", {
    token,
    user: sanitizedUser,
  });
};
// Firebase Authentication
const firebaseAuth = async (req, res) => {
  try {
    const userSysDetails = getUserSysDetails(req);
    let register = false;
    const idToken = req.body.idToken;

    if (!idToken) {
      return responseConfig.sendError(
        res,
        400,
        "Firebase ID token is required",
        "Firebase ID token is required",
      );
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);
    console.log(decodedToken);
    const { uid, email, name, picture } = decodedToken;

    const checkEmail = await getUserByEmail(email);
    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });
    if (!checkEmail) {
      register = true;
    }
    console.log(decodedToken);
    if (checkEmail && !user) {
      return responseConfig.sendError(res, 400, 1001, "User already exists");
    }

    // If user doesn't exist, create new user
    if (!user) {
      const [firstName, ...lastNameParts] = (name || email.split("@")[0]).split(
        " ",
      );
      const lastName = lastNameParts.join(" ") || "";

      user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          id: generateUUID(),
          firebaseUid: uid,
          firstName,
          lastName,
        },
      });
    }

    // Generate JWT token for our application
    const token = generateToken(user);
    if (register) {
      await sendEmail(
        user.email,
        `Welcome to ${env.APP_NAME}`,
        "",
        welcomeEmail({ firstName: user.firstName }),
      );
    }
    await createSession({
      ...userSysDetails,
      userID: user.id,
      token,
      sessionType: sessionType.ACCESS,
    });
    return responseConfig.sendSuccess(
      res,
      200,
      "Firebase authentication successful",
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          provider: user.provider,
        },
        token,
      },
    );
  } catch (error) {
    console.error("Firebase authentication error:", error);
    return responseConfig.sendError(res, 401, 999);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return responseConfig.sendError(res, 400, 1002, "User not found");
  }
  const token = generateResetPasswordToken(user);
  const userSysDetails = getUserSysDetails(req);
  await createSession({
    ...userSysDetails,
    userID: user.id,
    token,
    sessionType: sessionType.RESET_PASSWORD,
  });
  const resetLink = `${env.RESET_PASSWORD_URL}?token=${token}`;

  await sendEmail({
    from: "Shiya <" + appConfig.authEmail + ">",
    to: user.email,
    replyTo: appConfig.replyTo,
    subject: "Reset Password Request",
    text: "",
    html: resetPasswordEmail({
      firstName: user.firstName,
      resetLink,
    }),
  });

  return responseConfig.sendSuccess(res, 200, {
    message: "Password reset email sent",
    userMessage: "Please check your email to reset your password",
  });
};

const resetPassword = async (req, res) => {
  try {
    const { oobCode, password } = req.body;
    const decodedToken = verifyToken(oobCode);
    const user = await getUserById(decodedToken.id);
    if (!user) {
      return responseConfig.sendError(res, 400, 1007, "Invalid token");
    }
    if (!decodedToken) {
      return responseConfig.sendError(res, 400, 1007, "Invalid token");
    }
    const hashedPassword = await hashPassword(password);
    await updateUser(user.id, { password: hashedPassword });
    return responseConfig.sendSuccess(res, 200, "Password reset successfully");
  } catch (error) {
    console.error("Password reset error:", error);
    return responseConfig.sendError(res, 400, 999);
  }
};
const linkFirebaseAccount = async (req, res) => {
  console.log("req.user", req.user);
  const { firebaseUid } = req.body;
  const user = await updateUser(req.user.id, { firebaseUid });
  if (!user) {
    return responseConfig.sendError(res, 400, 1001, "User not found");
  }
  return responseConfig.sendSuccess(
    res,
    200,
    "Firebase account linked successfully",
  );
};

const loginWithCookies = async (req, res) => {
  try {
    const { email, password } = req.body;

    const origin = req.get("Origin");
    const referer = req.get("Referer");
    const allowedOrigins = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const originAllowed =
      (origin && allowedOrigins.includes(origin)) ||
      (!origin && referer && allowedOrigins.some((o) => referer.startsWith(o)));

    if (!originAllowed) {
      return responseConfig.sendError(
        res,
        403,
        1005,
        "CSRF protection: invalid origin",
      );
    }

    const user = await getUserByEmail(email);
    const userSysDetails = getUserSysDetails(req);

    if (!user) {
      return responseConfig.sendError(res, 404, 1002, "User not found");
    }

    if (!user.password) {
      if (!user.firebaseUid) {
        return responseConfig.sendError(res, 400, 1101);
      }
      return responseConfig.sendError(res, 400, 1102);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return responseConfig.sendError(res, 401, 1006, "Invalid password");
    }

    const token = generateToken(user);
    await createSession({
      ...userSysDetails,
      userID: user.id,
      token,
      sessionType: sessionType.ACCESS,
    });

    const csrfToken = crypto.randomBytes(32).toString("hex");
    const isProd = env.NODE_ENV === "production";

    res.cookie("sessionId", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    const sanitizedUser = sanitize(user);
    return responseConfig.sendSuccess(res, 200, "Login successful", {
      user: sanitizedUser,
      csrfToken,
    });
  } catch (error) {
    console.error("Login with Cookies middleware error:", error);
    return responseConfig.sendError(res, 401, 999);
  }
};

export default {
  loginWithCookies,
  login,
  register,
  firebaseAuth,
  forgotPassword,
  resetPassword,
  linkFirebaseAccount,
};
