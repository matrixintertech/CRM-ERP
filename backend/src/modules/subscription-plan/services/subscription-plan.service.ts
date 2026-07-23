import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SubscriptionPlanRepository } from '../repositories/subscription-plan.repository';

import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { GetSubscriptionPlansDto } from '../dto/get-subscription-plans.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  //CREATE PLAN

  async create(
  dto: CreateSubscriptionPlanDto,
) {

  // 1. Duplicate Code
  const plan =
    await this.subscriptionPlanRepository.findByCode(
      dto.code,
    );

  if (plan) {
    throw new ConflictException(
      'Subscription plan code already exists.',
    );
  }

  // 2. Create Plan
  const subscriptionPlan =
    await this.subscriptionPlanRepository.create({
      name: dto.name,
      code: dto.code,
      description: dto.description,
      planType: dto.planType,
      billingCycle: dto.billingCycle,
      price: dto.price,
      trialDays: dto.trialDays,
      isPublic: dto.isPublic,
    });

  // 3. Response
  return {
    message:
      'Subscription plan created successfully.',
    subscriptionPlan,
  };
}


async findAll(
  dto: GetSubscriptionPlansDto,
) {
  const skip =
    (dto.page - 1) * dto.limit;

  const subscriptionPlans =
    await this.subscriptionPlanRepository.findAll(
      skip,
      dto.limit,
      dto.search,
    );

  const total =
    await this.subscriptionPlanRepository.count(
      dto.search,
    );

  return {
    subscriptionPlans,
    pagination: {
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(
        total / dto.limit,
      ),
    },
  };
}


async findById(
  id: bigint,
) {
  const subscriptionPlan =
    await this.subscriptionPlanRepository.findById(
      id,
    );

  if (!subscriptionPlan) {
    throw new NotFoundException(
      'Subscription plan not found.',
    );
  }

  return {
    subscriptionPlan,
  };
}



async update(
  id: bigint,
  dto: UpdateSubscriptionPlanDto,
) {
  // 1. Subscription Plan Exists?
  const subscriptionPlan =
    await this.subscriptionPlanRepository.findById(
      id,
    );

  if (!subscriptionPlan) {
    throw new NotFoundException(
      'Subscription plan not found.',
    );
  }

  // 2. Duplicate Code
  if (dto.code) {
    const existingPlan =
      await this.subscriptionPlanRepository.findByCodeExceptId(
        dto.code,
        id,
      );

    if (existingPlan) {
      throw new ConflictException(
        'Subscription plan code already exists.',
      );
    }
  }

  // 3. Update
  const updatedPlan =
    await this.subscriptionPlanRepository.update(
      id,
      {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        planType: dto.planType,
        billingCycle: dto.billingCycle,
        price: dto.price,
        trialDays: dto.trialDays,
        isPublic: dto.isPublic,
      },
    );

  // 4. Response
  return {
    message:
      'Subscription plan updated successfully.',
    subscriptionPlan: updatedPlan,
  };
}



async delete(
  id: bigint,
) {
  const subscriptionPlan =
    await this.subscriptionPlanRepository.findById(
      id,
    );

  if (!subscriptionPlan) {
    throw new NotFoundException(
      'Subscription plan not found.',
    );
  }

  await this.subscriptionPlanRepository.softDelete(
    id,
  );

  return {
    message:
      'Subscription plan deleted successfully.',
  };
}




}