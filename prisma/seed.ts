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
  "user.view",
  "user.create",
  "user.update",
  "user.delete",
  "member.manage",
  "event.create",
  "event.update",
  "event.approve",
  "attendance.manage",
  "report.create",
  "report.approve",
  "media.upload",
  "media.delete",
  "announcement.publish",
  "stats.view",
  "role.assign",
];

async function main() {
  const hashedPassword = await bcrypt.hash("Admin12345!", 12);

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
      "member.manage",
      "event.create",
      "event.update",
      "attendance.manage",
      "report.create",
      "media.upload",
      "announcement.publish",
      "stats.view",
    ].includes(p.code),
  );

  const memberPermissions = permissions.filter((p) =>
    ["stats.view"].includes(p.code),
  );

  const presidentRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.PRESIDENT },
    update: {},
    create: {
      code: ROLE_CODES.PRESIDENT,
      name: "Topluluk Baskani",
    },
  });

  const managementRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.MANAGEMENT },
    update: {},
    create: {
      code: ROLE_CODES.MANAGEMENT,
      name: "Yonetim Ekibi",
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { code: ROLE_CODES.MEMBER },
    update: {},
    create: {
      code: ROLE_CODES.MEMBER,
      name: "Uye",
    },
  });

  for (const role of [presidentRole, managementRole]) {
    for (const permission of presidentPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  for (const permission of memberPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: memberRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: memberRole.id,
        permissionId: permission.id,
      },
    });
  }

  const user = await prisma.user.upsert({
    where: { email: "admin@t3.org.tr" },
    update: {
      passwordHash: hashedPassword,
      isActive: true,
    },
    create: {
      name: "T3 Super Admin",
      email: "admin@t3.org.tr",
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      id: `${user.id}-${superAdminRole.id}`,
    },
    update: {},
    create: {
      id: `${user.id}-${superAdminRole.id}`,
      userId: user.id,
      roleId: superAdminRole.id,
    },
  });

  const sampleUniversity = await prisma.university.upsert({
    where: { id: "seed-university-ytu" },
    update: {
      name: "Yildiz Teknik Universitesi",
      city: "Istanbul",
      status: "ACTIVE",
    },
    create: {
      id: "seed-university-ytu",
      name: "Yildiz Teknik Universitesi",
      city: "Istanbul",
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
      name: "T3 YTU Teknoloji Toplulugu",
      advisorName: "Dr. Ahmet Yilmaz",
      status: "ACTIVE",
    },
    create: {
      universityId: sampleUniversity.id,
      name: "T3 YTU Teknoloji Toplulugu",
      shortName: "T3YTU",
      advisorName: "Dr. Ahmet Yilmaz",
      status: "ACTIVE",
    },
  });

  const presidentPassword = await bcrypt.hash("Baskan12345!", 12);
  const presidentUser = await prisma.user.upsert({
    where: { email: "baskan@t3.org.tr" },
    update: {
      name: "Topluluk Baskani",
      passwordHash: presidentPassword,
      universityId: sampleUniversity.id,
      isActive: true,
    },
    create: {
      name: "Topluluk Baskani",
      email: "baskan@t3.org.tr",
      passwordHash: presidentPassword,
      universityId: sampleUniversity.id,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      id: `${presidentUser.id}-${presidentRole.id}-${sampleCommunity.id}`,
    },
    update: {},
    create: {
      id: `${presidentUser.id}-${presidentRole.id}-${sampleCommunity.id}`,
      userId: presidentUser.id,
      roleId: presidentRole.id,
      communityId: sampleCommunity.id,
    },
  });

  await prisma.communityMember.upsert({
    where: {
      communityId_userId: {
        communityId: sampleCommunity.id,
        userId: presidentUser.id,
      },
    },
    update: {
      membershipType: "PRESIDENT",
      status: "ACTIVE",
    },
    create: {
      communityId: sampleCommunity.id,
      userId: presidentUser.id,
      membershipType: "PRESIDENT",
      status: "ACTIVE",
    },
  });

  console.log("Seed tamamlandi. Ornek admin: admin@t3.org.tr / Admin12345!");
  console.log("Ornek baskan: baskan@t3.org.tr / Baskan12345!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
