

import fs from "fs";


const outputFile = "./blurhashesfinal.json";



//   {
//     "filename": "SCP_0773 copy.jpg",
//     "path": "products/2025-12-05-Anjelina-Jewls/SCP_0773 copy.jpg",
//     "url": "https://siriog.s3.ap-south-1.amazonaws.com/docs/1771750414737SCP_0773%20copy.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASBLNMKEB5PBJCVBD%2F20260222%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260222T085334Z&X-Amz-Expires=3600&X-Amz-Signature=958759b6d7a20c19ad8a0329ddc9a250db7a9bd835606c55e11f30fe325d809d&X-Amz-SignedHeaders=host&x-amz-acl=public-read&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject",
//     "filetype": ".jpg",
//     "blurHash": "UDT9Fj?b%~~q^+j[ofof%#ogI9RP_NofRjWA"
//   },
async function readJSON() {
  try {
    const data = await fs.readFileSync("./blurhashes.json", "utf-8");
    const json = JSON.parse(data);
    json.forEach((item) => {
      const single = new URL(item.url);
      const baseUrl = `${single.protocol}//${single.host}${single.pathname}`;
      item.final = baseUrl
    });
    fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Error reading JSON:", err);
  }
}


readJSON();
