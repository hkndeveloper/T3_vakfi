import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ROLE_CODES = {
  SUPER_ADMIN: "super_admin",
  PRESIDENT: "president",
  MANAGEMENT: "management_team",
  MEMBER: "member",
} as const;

const PERMISSIONS = [
  "admin.view",
  "user.view",
  "user.create",
  "user.update",
  "user.delete",
  "member.view",
  "member.manage",
  "event.view",
  "event.create",
  "event.update",
  "event.approve",
  "attendance.view",
  "attendance.manage",
  "report.view",
  "report.create",
  "report.approve",
  "media.view",
  "media.upload",
  "media.delete",
  "announcement.view",
  "announcement.publish",
  "stats.view",
  "role.assign",
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin12345!", 12);
  const baskanPassword = await bcrypt.hash("Baskan12345!", 12);
  const yonetimPassword = await bcrypt.hash("Yonetim12345!", 12);
  const uyePassword = await bcrypt.hash("Uye12345!", 12);

  const permissions = await Promise.all(
    PERMISSIONS.map((code) =>
      prisma.permission.upsert({
        where: { code },
        update: {},
        create: {
          code,
          name: code,
        },
      }),
    ),
  );

  const superAdminRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.SUPER_ADMIN },
    update: {},
    create: {
      code: ROLE_CODES.SUPER_ADMIN,
      name: "Super Admin",
    },
  });

  // Super Admin gets all permissions
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  const presidentPermissions = permissions.filter((p) =>
    [
      "member.view",
      "member.manage",
      "event.view",
      "event.create",
      "event.update",
      "attendance.view",
      "attendance.manage",
      "report.view",
      "report.create",
      "media.view",
      "media.upload",
      "media.delete",
      "announcement.view",
      "announcement.publish",
      "stats.view",
    ].includes(p.code),
  );

  const managementPermissions = permissions.filter((p) =>
    [
      "member.view",
      "event.view",
      "event.create",
      "report.view",
      "report.create",
      "media.view",
      "media.upload",
      "announcement.view",
    ].includes(p.code),
  );

  const memberPermissions = permissions.filter((p) =>
    [
      "member.view",
      "event.view",
      "attendance.view",
      "announcement.view",
      "stats.view",
    ].includes(p.code),
  );

  const presidentRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.PRESIDENT },
    update: {},
    create: {
      code: ROLE_CODES.PRESIDENT,
      name: "Topluluk Başkani",
    },
  });

  const managementRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.MANAGEMENT },
    update: {},
    create: {
      code: ROLE_CODES.MANAGEMENT,
      name: "Yönetim Ekibi",
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.MEMBER },
    update: {},
    create: {
      code: ROLE_CODES.MEMBER,
      name: "Üye",
    },
  });

  // Assign permissions to roles
  for (const permission of presidentPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: presidentRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: presidentRole.id, permissionId: permission.id },
    });
  }

  for (const permission of managementPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: managementRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: managementRole.id, permissionId: permission.id },
    });
  }

  for (const permission of memberPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: memberRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: memberRole.id, permissionId: permission.id },
    });
  }

  const superAdminUser = await prisma.user.upsert({
    where: { email: "admin@t3.org.tr" },
    update: {
      passwordHash: adminPassword,
      isActive: true,
    },
    create: {
      name: "T3 Süper Admin",
      email: "admin@t3.org.tr",
      passwordHash: adminPassword,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      id: `${superAdminUser.id}-${superAdminRole.id}`,
    },
    update: {},
    create: {
      id: `${superAdminUser.id}-${superAdminRole.id}`,
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
    },
  });

  const sampleUniversity = await prisma.university.upsert({
    where: { id: "seed-university-ytu" },
    update: {
      name: "Yıldız Teknik Üniversitesi",
      city: "İstanbul",
      status: "ACTIVE",
    },
    create: {
      id: "seed-university-ytu",
      name: "Yıldız Teknik Üniversitesi",
      city: "İstanbul",
      status: "ACTIVE",
    },
  });

  const sampleCommunity = await prisma.community.upsert({
    where: {
      universityId_shortName: {
        universityId: sampleUniversity.id,
        shortName: "T3YTU",
      },
    },
    update: {
      name: "T3 YTÜ Teknoloji Topluluğu",
      advisorName: "Dr. Ahmet Yılmaz",
      status: "ACTIVE",
    },
    create: {
      universityId: sampleUniversity.id,
      name: "T3 YTÜ Teknoloji Topluluğu",
      shortName: "T3YTU",
      advisorName: "Dr. Ahmet Yılmaz",
      status: "ACTIVE",
    },
  });

  // Example users for each role
  const roles = [
    { email: "baskan@t3.org.tr", name: "Topluluk Başkanı", role: presidentRole, password: baskanPassword, type: "PRESIDENT" },
    { email: "yonetim@t3.org.tr", name: "Yönetim Ekibi Üyesi", role: managementRole, password: yonetimPassword, type: "MANAGEMENT" },
    { email: "uye@t3.org.tr", name: "Kayıtlı Topluluk Üyesi", role: memberRole, password: uyePassword, type: "MEMBER" },
  ];

  for (const r of roles) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {
        name: r.name,
        passwordHash: r.password,
        universityId: sampleUniversity.id,
        isActive: true,
      },
      create: {
        name: r.name,
        email: r.email,
        passwordHash: r.password,
        universityId: sampleUniversity.id,
        isActive: true,
      },
    });

    await prisma.userRole.upsert({
      where: {
        id: `${user.id}-${r.role.id}-${sampleCommunity.id}`,
      },
      update: {},
      create: {
        id: `${user.id}-${r.role.id}-${sampleCommunity.id}`,
        userId: user.id,
        roleId: r.role.id,
        communityId: sampleCommunity.id,
      },
    });

    await prisma.communityMember.upsert({
      where: {
        communityId_userId: {
          communityId: sampleCommunity.id,
          userId: user.id,
        },
      },
      update: {
        membershipType: r.type as any,
        status: "ACTIVE",
      },
      create: {
        communityId: sampleCommunity.id,
        userId: user.id,
        membershipType: r.type as any,
        status: "ACTIVE",
      },
    });
  }

  console.log("\n--- SEED TAMAMLANDI ---");
  console.log("1. SÜPER ADMİN: admin@t3.org.tr / Admin12345!");
  console.log("2. BAŞKAN: baskan@t3.org.tr / Baskan12345!");
  console.log("3. YÖNETİM: yonetim@t3.org.tr / Yonetim12345!");
  console.log("4. ÜYE: uye@t3.org.tr / Uye12345!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
