import express from "express";
import { upload, handleUploadError } from "../middleware/upload.js";
import { sanitize } from "../config/sanitize.js";
import authMiddleware from "../middleware/auth.js";
import response from "../config/response.js";
const router = express.Router();

// router.post("/image", authMiddleware.authenticateToken, (req, res, next) => {
//   upload.single("image")(req, res, (err) => {
//     if (err) {
//       return handleUploadError(err, req, res, next);
//     }

//     // Check if file was uploaded
//     if (!req.file) {
//       return response.sendError(res, 400, 3001);
//     }

//     try {
//       // Prepare response data
//       const responseData = {
//         url: req.file.location,
//         key: req.file.key,
//         size: req.file.size,
//         mimetype: req.file.mimetype,
//         originalName: req.file.originalname,
//         uploadedAt: new Date().toISOString(),
//         uploadedBy: req.user?.id,
//       };

//       // Sanitize the response data
//       const sanitizedData = sanitize(responseData);

//       response.sendSuccess(
//         res,
//         200,
//         {
//           success: true,
//           message: "Image uploaded successfully",
//         },
//         sanitizedData
//       );
//     } catch (error) {
//       console.error("Upload response error:", error);
//       response.sendError(
//         res,
//         500,
//         3001,
//         "Upload processing failed",
//         "An error occurred while processing the upload"
//       );
//     }
//   });
// });

export default router;
