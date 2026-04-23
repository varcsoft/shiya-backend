import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { env } from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      // Initialize Firebase Admin with service account
      if (env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccountPath = join(
          __dirname,
          "../../",
          env.FIREBASE_SERVICE_ACCOUNT_KEY
        );
        const serviceAccount = JSON.parse(
          readFileSync(serviceAccountPath, "utf8")
        );
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: env.FIREBASE_PROJECT_ID,
        });
      } else {
        // For development, you can use application default credentials
        firebaseApp = admin.initializeApp({
          projectId: env.FIREBASE_PROJECT_ID,
        });
      }
      console.log("Firebase Admin SDK initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase Admin SDK:", error);
      throw error;
    }
  }
  return firebaseApp;
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<admin.auth.DecodedIdToken>} Decoded token
 */
export const verifyFirebaseToken = async (idToken) => {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    // throw error;
  }
};

/**
 * Get user by UID
 * @param {string} uid - Firebase user UID
 * @returns {Promise<admin.auth.UserRecord>} User record
 */
export const getFirebaseUser = async (uid) => {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error getting Firebase user:", error);
    throw error;
  }
};

export const createCustomToken = async (uid) => {
  try {
    const auth = getFirebaseAuth();
    const customToken = await auth.createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error;
  }
};

export default {
  initializeFirebase,
  getFirebaseAuth,
  verifyFirebaseToken,
  getFirebaseUser,
  createCustomToken,
};
