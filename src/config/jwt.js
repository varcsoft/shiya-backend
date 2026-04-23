import { env } from "./env.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user?.avatar ?? "",
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    // console.log(error);
    return false;
  }
};
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true }).payload;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { generateToken, verifyToken, decodeToken };
