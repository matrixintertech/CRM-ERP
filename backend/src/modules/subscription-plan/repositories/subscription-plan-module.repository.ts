import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubscriptionPlanModuleRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createMany(
  subscriptionPlanId: bigint,
  moduleIds: string[],
) {
  return this.prisma.subscriptionPlanModule.createMany({
    data: moduleIds.map((moduleId) => ({
      subscriptionPlanId,
      moduleId: BigInt(moduleId),
    })),
    skipDuplicates: true,
  });
}

  async deleteByPlanId(
    subscriptionPlanId: bigint,
  ) {
    return this.prisma.subscriptionPlanModule.deleteMany({
      where: {
        subscriptionPlanId,
      },
    });
  }

  async findByPlanId(
    subscriptionPlanId: bigint,
  ) {
    return this.prisma.subscriptionPlanModule.findMany({
      where: {
        subscriptionPlanId,
      },
      include: {
        module: true,
      },
      orderBy: {
        module: {
          sortOrder: 'asc',
        },
      },
    });
  }
}