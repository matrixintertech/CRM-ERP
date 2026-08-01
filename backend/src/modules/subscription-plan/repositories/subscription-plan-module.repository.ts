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
  if (moduleIds.length === 0) {
    return {
      count: 0,
    };
  }

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
        module: {
          deletedAt: null,
        },
      },

      select: {
        id: true,
        createdAt: true,

        module: {
          select: {
            id: true,
            uuid: true,
            name: true,
            code: true,
            icon: true,
            route: true,
            sortOrder: true,
            isMenu: true,
            isVisible: true,
            isSystem: true,
            status: true,
          },
        },
      },

      orderBy: {
        module: {
          sortOrder: 'asc',
        },
      },
    });
  }

  async replaceModules(
  subscriptionPlanId: bigint,
  moduleIds: string[],
) {
  return this.prisma.$transaction(
    async (transaction) => {
      await transaction.subscriptionPlanModule.deleteMany({
        where: {
          subscriptionPlanId,
        },
      });

      if (moduleIds.length === 0) {
        return {
          count: 0,
        };
      }

      return transaction.subscriptionPlanModule.createMany({
        data: moduleIds.map((moduleId) => ({
          subscriptionPlanId,
          moduleId: BigInt(moduleId),
        })),
        skipDuplicates: true,
      });
    },
  );
}
}