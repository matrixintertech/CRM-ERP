import { Prisma } from '@prisma/client';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SubscriptionPlanRepository } from '../repositories/subscription-plan.repository';
import { SubscriptionPlanModuleRepository } from '../repositories/subscription-plan-module.repository';


import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { GetSubscriptionPlansDto } from '../dto/get-subscription-plans.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
     private readonly subscriptionPlanModuleRepository: SubscriptionPlanModuleRepository,
  ) {}

  //CREATE PLAN

async create(
  dto: CreateSubscriptionPlanDto,
) {
  try {
    const {
      moduleIds = [],
      ...planData
    } = dto;

    // Duplicate Code
    const plan =
      await this.subscriptionPlanRepository.findByCode(
        planData.code,
      );

    if (plan) {
      throw new ConflictException(
        'Subscription plan code already exists.',
      );
    }

    // Create Plan
    const subscriptionPlan =
      await this.subscriptionPlanRepository.create(
        planData,
      );

    // Create Module Mapping
    if (moduleIds.length > 0) {
      await this.subscriptionPlanModuleRepository.createMany(
        subscriptionPlan.id,
        moduleIds,
      );
    }

    return {
      message:
        'Subscription plan created successfully.',
      subscriptionPlan,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Subscription plan code already exists.',
      );
    }

    throw error;
  }
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
  // 1. Find Plan
  const subscriptionPlan =
    await this.subscriptionPlanRepository.findById(
      id,
    );

  if (!subscriptionPlan) {
    throw new NotFoundException(
      'Subscription plan not found.',
    );
  }

  // 2. Find Selected Modules
  const selectedModules =
    await this.subscriptionPlanModuleRepository.findByPlanId(
      id,
    );

  // 3. Return Plan + Module Ids + Modules
  return {
    subscriptionPlan: {
      ...subscriptionPlan,

      moduleIds: selectedModules.map(
        (item) => item.moduleId.toString(),
      ),

      modules: selectedModules.map(
        (item) => ({
          id: item.module.id.toString(),
          name: item.module.name,
          code: item.module.code,
          icon: item.module.icon,
        }),
      ),
    },
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

  // 3. Separate Module Ids
  const {
    moduleIds = [],
    ...planData
  } = dto;

  // 4. Update Subscription Plan
  const updatedPlan =
    await this.subscriptionPlanRepository.update(
      id,
      planData,
    );

  // 5. Update Module Mapping
  await this.subscriptionPlanModuleRepository.deleteByPlanId(
    id,
  );

  if (moduleIds.length > 0) {
    await this.subscriptionPlanModuleRepository.createMany(
      id,
      moduleIds,
    );
  }

  // 6. Response
  return {
    message:
      'Subscription plan updated successfully.',
    subscriptionPlan: updatedPlan,
  };
}


async delete(
  id: bigint,
) {
  // 1. Check Exists
  const subscriptionPlan =
    await this.subscriptionPlanRepository.findById(
      id,
    );

  if (!subscriptionPlan) {
    throw new NotFoundException(
      'Subscription plan not found.',
    );
  }

  // 2. Delete Module Mapping
  await this.subscriptionPlanModuleRepository.deleteByPlanId(
    id,
  );

  // 3. Soft Delete Plan
  await this.subscriptionPlanRepository.softDelete(
    id,
  );

  // 4. Response
  return {
    message:
      'Subscription plan deleted successfully.',
  };
}




}