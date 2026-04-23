import express from "express";
import verifySchema from "../config/myzod.js";
import auth, { requireAdmin } from "../middleware/auth.js";
import {
  //   createSuperspecificationC,
  getSuperspecificationsC,
  //   deleteSuperspecificationC,
} from "../controllers/superspecificationController.js";
// import { superspecificationSchema } from "../Models/Validations/SuperspecificationSchema.js";

const router = express.Router();

// router.post(
//   "/",
//   auth.authenticateToken,
//   verifySchema(superspecificationSchema),
//   createSuperspecificationC,
// );

router.get("/", auth.authenticateToken, requireAdmin, getSuperspecificationsC);

// router.delete("/:id", auth.authenticateToken, deleteSuperspecificationC);

export default router;
