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

  async create(
    data: Prisma.SubscriptionPlanCreateInput,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.create({
      data,
    });
  }

  async findById(
    id: bigint,
  ): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByUuid(
    uuid: string,
  ): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }

  async findByCode(
    code: string,
  ): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        code,
        deletedAt: null,
      },
    });
  }

  async findByCodeExceptId(
    code: string,
    id: bigint,
  ): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        code,
        deletedAt: null,
        id: {
          not: id,
        },
      },
    });
  }

  async findAll(
    skip: number,
    take: number,
    search?: string,
  ) {
    return this.prisma.subscriptionPlan.findMany({
      where: this.buildWhere(search),

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
        durationInDays: true,
        maxUsers: true,
        maxBranches: true,
        maxProjects: true,
        sortOrder: true,
        isPublic: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            subscriptionPlanModules: true,
            companySubscriptions: true,
          },
        },
      },

      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],

      skip,
      take,
    });
  }

  async count(
    search?: string,
  ): Promise<number> {
    return this.prisma.subscriptionPlan.count({
      where: this.buildWhere(search),
    });
  }

  async update(
    id: bigint,
    data: Prisma.SubscriptionPlanUpdateInput,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(
    id: bigint,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  private buildWhere(
    search?: string,
  ): Prisma.SubscriptionPlanWhereInput {
    const normalizedSearch = search?.trim();

    return {
      deletedAt: null,

      ...(normalizedSearch && {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: normalizedSearch,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };
  }
}