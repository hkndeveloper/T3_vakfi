import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminPassword = await bcrypt.hash("Admin12345!", 12);
    const baskanPassword = await bcrypt.hash("Baskan12345!", 12);
    const yonetimPassword = await bcrypt.hash("Yonetim12345!", 12);
    const uyePassword = await bcrypt.hash("Uye12345!", 12);

    const accounts = [
      { email: "admin@t3.org.tr", name: "T3 Süper Admin", password: adminPassword },
      { email: "baskan@t3.org.tr", name: "Topluluk Başkanı", password: baskanPassword },
      { email: "yonetim@t3.org.tr", name: "Yönetim Ekibi Üyesi", password: yonetimPassword },
      { email: "uye@t3.org.tr", name: "Kayıtlı Topluluk Üyesi", password: uyePassword },
    ];

    const results = [];

    for (const acc of accounts) {
      const user = await prisma.user.upsert({
        where: { email: acc.email },
        update: {
          passwordHash: acc.password,
          isActive: true,
          name: acc.name,
        },
        create: {
          email: acc.email,
          name: acc.name,
          passwordHash: acc.password,
          isActive: true,
        },
      });
      results.push(`${acc.email} güncellendi.`);
    }

    return NextResponse.json({
      success: true,
      message: "Tüm test hesapları başarıyla sıfırlandı ve aktif edildi.",
      details: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
