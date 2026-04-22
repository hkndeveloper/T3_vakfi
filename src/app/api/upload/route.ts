import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "@/lib/permissions";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    try {
      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      });

      await r2Client.send(command);

      // Final URL
      const baseUrl = R2_PUBLIC_URL.endsWith("/") ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
      const fileUrl = `${baseUrl}/${fileName}`;

      return NextResponse.json({ 
        success: true, 
        url: fileUrl,
        name: file.name,
        type: file.type
      });
    } catch (s3Error: any) {
      console.error("S3/R2 Internal Error:", s3Error);
      // Hatayı detaylıca döndür ki ne olduğunu görelim
      return NextResponse.json({ 
        error: "Bulut depolama hatası", 
        details: s3Error.message,
        code: s3Error.code,
        metadata: s3Error.$metadata
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("General Upload error:", error);
    return NextResponse.json({ error: "Dosya işlenirken bir hata oluştu.", details: error.message }, { status: 500 });
  }
}
