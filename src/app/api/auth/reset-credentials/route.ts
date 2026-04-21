import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const results = [];
    
    // 1. Rollere emin ol
    const roles = [
      { code: "super_admin", name: "Super Admin" },
      { code: "president", name: "Topluluk Başkanı" },
      { code: "management_team", name: "Yönetim Ekibi" },
      { code: "member", name: "Üye" },
    ];

    for (const r of roles) {
      await prisma.role.upsert({
        where: { code: r.code },
        update: { name: r.name },
        create: { code: r.code, name: r.name },
      });
    }

    const testEmails = ["admin@t3.org.tr", "baskan@t3.org.tr", "yonetim@t3.org.tr", "uye@t3.org.tr"];
    
    // 2. Mevcut hatalı kayıtları temizle (Zorunlu temizlik)
    for (const email of testEmails) {
      try {
        await prisma.user.delete({ where: { email } });
      } catch (e) {
        // Kullanıcı yoksa hata vermesin
      }
    }

    // 1. Üniversite ve Topluluğa emin ol (Döngüyü kırmak için şart)
    const testUni = await prisma.university.upsert({
      where: { id: "test-uni-id" },
      update: { name: "Test Üniversitesi", city: "İstanbul" },
      create: { id: "test-uni-id", name: "Test Üniversitesi", city: "İstanbul" },
    });

    const testCommunity = await prisma.community.upsert({
      where: { universityId_shortName: { universityId: testUni.id, shortName: "TEST" } },
      update: { name: "Test Teknoloji Topluluğu" },
      create: { 
        universityId: testUni.id, 
        name: "Test Teknoloji Topluluğu", 
        shortName: "TEST",
        status: "ACTIVE"
      },
    });

    const accounts = [
      { email: "admin@t3.org.tr", name: "T3 Süper Admin", password: "Admin12345!", role: "super_admin" },
      { email: "baskan@t3.org.tr", name: "Topluluk Başkanı", password: "Baskan12345!", role: "president" },
      { email: "yonetim@t3.org.tr", name: "Yönetim Ekibi Üyesi", password: "Yonetim12345!", role: "management_team" },
      { email: "uye@t3.org.tr", name: "Kayıtlı Topluluk Üyesi", password: "Uye12345!", role: "member" },
    ];

    for (const acc of accounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      
      const user = await prisma.user.create({
        data: {
          email: acc.email,
          name: acc.name,
          passwordHash: hashedPassword,
          isActive: true,
          universityId: testUni.id,
        },
      });

      const role = await prisma.role.findUnique({ where: { code: acc.role } });
      if (role) {
        await prisma.userRole.create({
          data: {
             userId: user.id,
             roleId: role.id,
             communityId: acc.role !== "super_admin" ? testCommunity.id : null
          }
        });

        // Üyelik kaydını da yap
        if (acc.role !== "super_admin") {
          await prisma.communityMember.create({
            data: {
              communityId: testCommunity.id,
              userId: user.id,
              membershipType: acc.role === "president" ? "PRESIDENT" : (acc.role === "management_team" ? "MANAGEMENT" : "MEMBER"),
              status: "ACTIVE"
            }
          });
        }
      }
      
      results.push(`${acc.email} (${acc.role}) topluluk bağlantısı ile oluşturuldu.`);
    }

    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "SİSTEM DERİN TEMİZLİK VE ONARIM TAMAMLANDI.",
      totalUsersInDb: totalUsers,
      details: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
