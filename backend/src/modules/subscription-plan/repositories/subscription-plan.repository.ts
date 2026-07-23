import { Injectable } from '@nestjs/common';
import {
  Prisma,
  SubscriptionPlan,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubscriptionPlanRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create Subscription Plan
   */
  async create(
    data: Prisma.SubscriptionPlanCreateInput,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.create({
      data,
    });
  }

  /**
   * Find By ID
   */
  async findById(
    id: bigint,
  ) {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Find By Code
   */
  async findByCode(
    code: string,
  ) {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        code,
        deletedAt: null,
      },
    });
  }

  /**
   * List
   */
  async findAll(
    skip: number,
    take: number,
    search?: string,
  ) {
    return this.prisma.subscriptionPlan.findMany({
      where: {
        deletedAt: null,

        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,
        description: true,
        planType: true,
        billingCycle: true,
        price: true,
        trialDays: true,
        isPublic: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      skip,
      take,
    });
  }

  /**
   * Count
   */
  async count(
    search?: string,
  ) {
    return this.prisma.subscriptionPlan.count({
      where: {
        deletedAt: null,

        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
  }

  /**
   * Update
   */
  async update(
    id: bigint,
    data: Prisma.SubscriptionPlanUpdateInput,
  ) {
    return this.prisma.subscriptionPlan.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Soft Delete
   */
  async softDelete(
    id: bigint,
  ) {
    return this.prisma.subscriptionPlan.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }



async findByCodeExceptId(
  code: string,
  id: bigint,
) {
  return this.prisma.subscriptionPlan.findFirst({
    where: {
      code,
      deletedAt: null,
      NOT: {
        id,
      },
    },
  });
}








  
}