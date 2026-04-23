import fs from "fs";
import sharp from "sharp";
import { encode } from "blurhash";
import path from "path";
import { getPresignedUrl } from "./src/config/s3.js";
import axios from "axios";

const getAllFiles = (dir) => {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      // If directory, recurse into it
      results = results.concat(getAllFiles(fullPath));
    } else {
      // If file, add to results
      results.push(fullPath);
    }
  });

  return results;
};

async function generateBlurHash(path) {
  // Resize for performance (32x32 is enough)
  const { data, info } = await sharp(path)
    .resize(32, 32, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4, // x components
    4, // y components
  );

  return blurhash;
}

const imagePaths = getAllFiles("./products");
// console.log(imagePaths);
(async () => {
  try {
    const blurhashes = [];
    for (const imagePath of imagePaths) {
      if (
        path.extname(imagePath) !== ".jpg" &&
        path.extname(imagePath) !== ".png"
      ) {
        continue;
      }

      const filename = path.basename(imagePath);
      const url = await getPresignedUrl(Date.now() + filename);
      const hash = await generateBlurHash(imagePath);
      const filetype = path.extname(imagePath);
      blurhashes.push({
        filename: filename,
        path: imagePath,
        url: url,
        filetype: filetype,
        blurHash: hash,
      });
    }
    // await fs.writeFileSync(
    //   "./blurhashes.json",
    //   JSON.stringify(blurhashes, null, 2),
    // );
    const fileTypes = {
      ".jpg": "jpeg",
      ".png": "png",
      ".jpeg": "jpeg",
    };

    for (const blurhash of blurhashes) {
      try {
        const fileStream = fs.createReadStream(blurhash.path);

        // await axios.put(blurhash.url, fileStream, {
        //   headers: {
        //     "Content-Type": `image/${fileTypes[blurhash.filetype]}`,
        //     "Content-Length": fs.statSync(blurhash.path).size,
        //   },
        //   maxBodyLength: Infinity,
        // });

        console.log("Uploaded:", blurhash.filename);
      } catch (err) {
        console.error("Upload failed:", blurhash.filename, err.message);
      }
    }
    console.log(blurhashes.length);
  } catch (error) {
    console.error("Error generating blurhash:", error);
  }
})();

