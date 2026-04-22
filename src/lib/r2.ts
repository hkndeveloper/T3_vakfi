import { S3Client } from "@aws-sdk/client-s3";

// Değişkenleri temizle (https:// gibi önekleri kaldır)
const rawAccountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accountId = rawAccountId.replace(/^https?:\/\//, "").replace(/\/$/, "");

const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("R2 CONFIGURATION WARNING: Missing credentials!");
}

export const r2Client = new S3Client({
  region: "us-east-1", // R2 uyumluluğu için standart bölge
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false, // Sanal ana makine stilini kullan (R2 için varsayılan)
});

export const R2_BUCKET_NAME = (process.env.R2_BUCKET_NAME || "").trim();
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim();
