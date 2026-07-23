import { PrismaClient } from '@prisma/client';
import { seedOwner } from './seeds/owner.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await seedOwner(prisma);

  console.log('✅ Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });