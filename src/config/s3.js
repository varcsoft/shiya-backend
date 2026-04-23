import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import multer from "multer";
import multerS3 from "multer-s3";

import { env } from "./env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3 = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

// Configure multer with S3 storage

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const folder = req.query.folder || "docs";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${folder}/${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images, documents, and common file types
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, PDFs, and documents are allowed."
        )
      );
    }
  },
});

// Direct upload function for programmatic use
const uploadFile = async (file, key) => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    const result = await s3.send(command);
    return {
      success: true,
      url: `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com/${key}`,
      key: key,
    };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

const getPresignedUrl = async (fileName) => {
  try {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: `docs/${fileName}`,
      CacheControl: "public, max-age=31536000, immutable",
      // ContentType: fileType,
      ACL: "public-read",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    // console.log(url);
    return url;
  } catch (err) {
    console.error(err);
    throw new Error("Error generating pre-signed URL");
  }
};

export { s3, upload, uploadFile, getPresignedUrl };
