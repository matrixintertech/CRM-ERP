import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubscriptionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Existing CRUD methods...

  async findPlanModules(
    subscriptionPlanId: bigint,
  ) {
    return this.prisma.subscriptionPlanModule.findMany(
      {
        where: {
          subscriptionPlanId,
        },
        select: {
          moduleId: true,
        },
      },
    );
  }

  async assignPlanModules(
    subscriptionPlanId: bigint,
    moduleIds: bigint[],
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.subscriptionPlanModule.deleteMany(
          {
            where: {
              subscriptionPlanId,
            },
          },
        );

        if (
          moduleIds.length > 0
        ) {
          await tx.subscriptionPlanModule.createMany(
            {
              data: moduleIds.map(
                (moduleId) => ({
                  subscriptionPlanId,
                  moduleId,
                }),
              ),
            },
          );
        }
      },
    );
  }
}