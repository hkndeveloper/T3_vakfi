import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { email: true, isActive: true },
  });
  console.log("Database Users:", users);
  process.exit(0);
}

checkUsers();
