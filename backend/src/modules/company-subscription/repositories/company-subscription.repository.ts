import { Injectable } from '@nestjs/common';

import {
  CompanySubscription,
  Prisma,
  SubscriptionStatus,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CompanySubscriptionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.CompanySubscriptionCreateInput,
  ): Promise<CompanySubscription> {
    return this.prisma.companySubscription.create({
      data,
    });
  }

  async findCompanyById(
    id: bigint,
  ) {
    return this.prisma.company.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findSubscriptionPlanById(
    id: bigint,
  ) {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findActiveByCompanyId(
    companyId: bigint,
  ) {
    return this.prisma.companySubscription.findFirst({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }
}