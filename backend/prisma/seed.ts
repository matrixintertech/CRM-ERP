import { PrismaClient } from "@prisma/client";

import { seedPermissions } from "./seeds/permission.seed";
import { seedOwner } from "./seeds/owner.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await seedPermissions(prisma);

  await seedOwner(prisma);

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });