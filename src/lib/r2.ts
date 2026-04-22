import { S3Client } from "@aws-sdk/client-s3";

// Sadece harf ve rakamları tut, küçük harfe çevir
const rawAccountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accountId = rawAccountId.replace(/[^a-z0-9]/gi, "").toLowerCase();

const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();

const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  // SSL hatalarını önlemek için virtual-host stilini zorla (R2 standardı)
  forcePathStyle: false,
});

export const R2_BUCKET_NAME = (process.env.R2_BUCKET_NAME || "").trim();
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim();
