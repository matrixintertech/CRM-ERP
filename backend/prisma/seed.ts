import {
  PrismaClient,
} from "@prisma/client";

import {
  seedPermissions,
} from "./seeds/permission.seed";

import {
  seedOwner,
} from "./seeds/owner.seed";

import {
  seedCompanyAdminSync,
} from "./seeds/company-admin-sync.seed";


const prisma =
  new PrismaClient();


async function main() {
  console.log(
    "🌱 Seeding database...",
  );

  /*
   * 1. Canonical permission catalog
   */
  await seedPermissions(
    prisma,
  );


  /*
   * 2. Platform owner
   */
  await seedOwner(
    prisma,
  );


  /*
   * 3. Repair/sync existing
   *    Company Admin RBAC
   */
  await seedCompanyAdminSync(
    prisma,
  );


  console.log(
    "✅ Database seeded successfully.",
  );
}


main()
  .catch((error) => {
    console.error(
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });