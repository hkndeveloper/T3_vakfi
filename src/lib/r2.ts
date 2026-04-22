import { S3Client } from "@aws-sdk/client-s3";

// Sadece harf ve rakamları tut (boşluk, nokta, slash hepsini siler)
const rawAccountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accountId = rawAccountId.replace(/[^a-z0-9]/gi, "");

const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();

const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

// Debug log (Hassas bilgileri maskeleyerek)
console.log("--- R2 Configuration Debug ---");
console.log("Account ID Masked:", accountId.substring(0, 4) + "..." + accountId.substring(accountId.length - 4));
console.log("Endpoint:", endpoint);
console.log("Bucket Name:", (process.env.R2_BUCKET_NAME || "").trim());
console.log("------------------------------");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false,
});

export const R2_BUCKET_NAME = (process.env.R2_BUCKET_NAME || "").trim();
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim();
