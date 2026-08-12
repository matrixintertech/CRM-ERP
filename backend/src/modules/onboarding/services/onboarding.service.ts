import {
  Injectable,
} from '@nestjs/common';

import {
  UserStatus,
  UserType,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

import {
  CompanyService,
} from 'src/modules/company/services/company.service';

import {
  CompanySubscriptionService,
} from 'src/modules/company-subscription/services/company-subscription.service';

import {
  UserService,
} from 'src/modules/user/services/user.service';

import {
  CreateOnboardingDto,
} from '../dto/create-onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyService:
      CompanyService,

    private readonly companySubscriptionService:
      CompanySubscriptionService,

    private readonly userService:
      UserService,
  ) {}

  async create(
    dto: CreateOnboardingDto,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        // 1. Create Company
        const company =
          await this.companyService.create(
            dto.company,
            tx,
          );

        // 2. Assign Subscription
        const startDate =
          new Date();

        const endDate =
          new Date(
            startDate,
          );

        endDate.setMonth(
          endDate.getMonth() +
            1,
        );

        const subscription =
          await this.companySubscriptionService.create(
            {
              companyId:
                Number(
                  company.id,
                ),

              subscriptionPlanId:
                dto.subscription
                  .subscriptionPlanId,

              startDate:
                startDate.toISOString(),

              endDate:
                endDate.toISOString(),
            },
            tx,
          );

        // 3. Create Company Admin
       const admin =
  await this.userService.create(
          {
            displayName:
              dto.admin.displayName,

            email:
              dto.admin.email,

            mobile:
              dto.admin.mobile,
          },
          {
            companyId:
              company.id,

            userType:
              UserType.COMPANY_ADMIN,

            status:
              UserStatus.ACTIVE,
          },
          tx,
        );
        
        return {
          message:
            'Company onboarding completed successfully.',

          company,

          subscription,

          admin,
        };
      },
    );
  }
}