import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const results: string[] = [];
    // 1. Tüm Sistem Yetkilerini Tanımla
    const PERMISSIONS = [
      "admin.view", "user.view", "user.create", "user.update", "user.delete",
      "member.view", "member.manage", "event.view", "event.create", "event.update",
      "event.approve", "attendance.view", "attendance.manage", "report.view",
      "report.create", "report.approve", "media.view", "media.upload", "media.delete",
      "announcement.view", "announcement.publish", "stats.view", "role.assign"
    ];

    const permissionMap = new Map();
    for (const code of PERMISSIONS) {
      const p = await prisma.permission.upsert({
        where: { code },
        update: { name: code },
        create: { code, name: code },
      });
      permissionMap.set(code, p.id);
    }

    // 2. Rollere ve Yetkilerine emin ol
    const roleDefinitions = [
      { code: "super_admin", name: "Super Admin", perms: PERMISSIONS },
      { code: "president", name: "Topluluk Başkanı", perms: ["member.view", "event.view", "event.create", "report.view", "report.create", "announcement.view", "stats.view"] },
      { code: "management_team", name: "Yönetim Ekibi", perms: ["member.view", "event.view", "report.view", "announcement.view"] },
      { code: "member", name: "Üye", perms: ["member.view", "event.view", "announcement.view"] },
    ];

    for (const r of roleDefinitions) {
      const role = await prisma.role.upsert({
        where: { code: r.code },
        update: { name: r.name },
        create: { code: r.code, name: r.name },
      });

      // Yetkileri role bağla
      for (const pCode of r.perms) {
        const pId = permissionMap.get(pCode);
        if (pId) {
          await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: role.id, permissionId: pId } },
            update: {},
            create: { roleId: role.id, permissionId: pId },
          });
        }
      }
    }

    // 3. Üniversite ve Topluluğa emin ol
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
      
      // 3. Varsa GÜNCELLE, yoksa OLUŞTUR
      const user = await prisma.user.upsert({
        where: { email: acc.email },
        update: {
          passwordHash: hashedPassword,
          isActive: true,
          name: acc.name,
          universityId: testUni.id,
        },
        create: {
          email: acc.email,
          name: acc.name,
          passwordHash: hashedPassword,
          isActive: true,
          universityId: testUni.id,
        },
      });

      const role = await prisma.role.findUnique({ where: { code: acc.role } });
      if (role) {
        // Role atamasını da güvenli yap
        await prisma.userRole.upsert({
          where: { id: `${user.id}-${role.id}` },
          update: {
            communityId: acc.role !== "super_admin" ? testCommunity.id : null
          },
          create: {
             id: `${user.id}-${role.id}`,
             userId: user.id,
             roleId: role.id,
             communityId: acc.role !== "super_admin" ? testCommunity.id : null
          }
        });

        if (acc.role !== "super_admin") {
          await prisma.communityMember.upsert({
            where: { communityId_userId: { communityId: testCommunity.id, userId: user.id } },
            update: {
              membershipType: acc.role === "president" ? "PRESIDENT" : (acc.role === "management_team" ? "MANAGEMENT" : "MEMBER"),
              status: "ACTIVE"
            },
            create: {
              communityId: testCommunity.id,
              userId: user.id,
              membershipType: acc.role === "president" ? "PRESIDENT" : (acc.role === "management_team" ? "MANAGEMENT" : "MEMBER"),
              status: "ACTIVE"
            }
          });
        }
      }
      
      results.push(`${acc.email} (${acc.role}) başarıyla güncellendi/onarıldı.`);
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
