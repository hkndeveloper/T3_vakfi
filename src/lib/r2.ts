import { S3Client } from "@aws-sdk/client-s3";

const accountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("R2 Configuration is missing! Check your environment variables.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  // R2 için bazı durumlarda bu ayar SSL hatalarını çözebilir
  forcePathStyle: true,
});

export const R2_BUCKET_NAME = (process.env.R2_BUCKET_NAME || "").trim();
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim();
