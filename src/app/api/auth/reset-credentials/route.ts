import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminPassword = await bcrypt.hash("Admin12345!", 12);
    const baskanPassword = await bcrypt.hash("Baskan12345!", 12);
    const yonetimPassword = await bcrypt.hash("Yonetim12345!", 12);
    const uyePassword = await bcrypt.hash("Uye12345!", 12);

    const roles = [
      { code: "super_admin", name: "Super Admin" },
      { code: "president", name: "Topluluk Başkanı" },
      { code: "management_team", name: "Yönetim Ekibi" },
      { code: "member", name: "Üye" },
    ];

    // 1. Rollere emin ol
    for (const r of roles) {
      await prisma.role.upsert({
        where: { code: r.code },
        update: { name: r.name },
        create: { code: r.code, name: r.name },
      });
    }

    const accounts = [
      { email: "admin@t3.org.tr", name: "T3 Süper Admin", password: adminPassword, role: "super_admin" },
      { email: "baskan@t3.org.tr", name: "Topluluk Başkanı", password: baskanPassword, role: "president" },
      { email: "yonetim@t3.org.tr", name: "Yönetim Ekibi Üyesi", password: yonetimPassword, role: "management_team" },
      { email: "uye@t3.org.tr", name: "Kayıtlı Topluluk Üyesi", password: uyePassword, role: "member" },
    ];

    const results = [];

    for (const acc of accounts) {
      // 2. Kullanıcıyı güncelle/oluştur
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

      // 3. Rolü ata
      const role = await prisma.role.findUnique({ where: { code: acc.role } });
      if (role) {
        await prisma.userRole.upsert({
          where: { id: `${user.id}-${role.id}` },
          update: {},
          create: {
             id: `${user.id}-${role.id}`,
             userId: user.id,
             roleId: role.id
          }
        });
      }
      
      results.push(`${acc.email} (${acc.role}) başarıyla güncellendi.`);
    }

    return NextResponse.json({
      success: true,
      message: "Sistem rolleri ve test hesapları tam yetki ile senkronize edildi.",
      details: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
