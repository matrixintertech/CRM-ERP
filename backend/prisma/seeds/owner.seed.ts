import { PrismaClient, UserStatus } from '@prisma/client';

export async function seedOwner(prisma: PrismaClient) {
  const email = 'anil@gmail.com';

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    console.log('✅ Software Owner already exists.');
    return;
  }

  await prisma.user.create({
    data: {
      email,
      displayName: 'Anil K',
      emailVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('✅ Software Owner created.');
}