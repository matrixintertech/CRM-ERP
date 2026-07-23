import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CompanySubscriptionRepository } from '../repositories/company-subscription.repository';

import { CreateCompanySubscriptionDto } from '../dto/create-company-subscription.dto';

@Injectable()
export class CompanySubscriptionService {
  constructor(
    private readonly companySubscriptionRepository: CompanySubscriptionRepository,
  ) {}

  async create(
    dto: CreateCompanySubscriptionDto,
  ) {
    // 1. Company Exists?
    const company =
      await this.companySubscriptionRepository.findCompanyById(
        BigInt(dto.companyId),
      );

    if (!company) {
      throw new NotFoundException(
        'Company not found.',
      );
    }

    // 2. Subscription Plan Exists?
    const subscriptionPlan =
      await this.companySubscriptionRepository.findSubscriptionPlanById(
        BigInt(dto.subscriptionPlanId),
      );

    if (!subscriptionPlan) {
      throw new NotFoundException(
        'Subscription plan not found.',
      );
    }

    // 3. Active Subscription Check
    const activeSubscription =
      await this.companySubscriptionRepository.findActiveByCompanyId(
        BigInt(dto.companyId),
      );

    if (activeSubscription) {
      throw new ConflictException(
        'Company already has an active subscription.',
      );
    }

    // 4. Create Subscription
    const companySubscription =
      await this.companySubscriptionRepository.create({
        company: {
          connect: {
            id: BigInt(dto.companyId),
          },
        },

        subscriptionPlan: {
          connect: {
            id: BigInt(dto.subscriptionPlanId),
          },
        },

        startDate: new Date(
          dto.startDate,
        ),

        endDate: dto.endDate
          ? new Date(dto.endDate)
          : null,
      });

    // 5. Response
    return {
      message:
        'Company subscription assigned successfully.',
      companySubscription,
    };
  }
}