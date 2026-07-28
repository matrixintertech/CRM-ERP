import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { SubscriptionPlanController } from './controllers/subscription-plan.controller';
import { SubscriptionPlanService } from './services/subscription-plan.service';
import { SubscriptionPlanRepository } from './repositories/subscription-plan.repository';
import { SubscriptionPlanModuleRepository } from './repositories/subscription-plan-module.repository';

@Module({
  imports: [PrismaModule],

  controllers: [
    SubscriptionPlanController,
  ],

  providers: [
    SubscriptionPlanService,
    SubscriptionPlanRepository,
    SubscriptionPlanModuleRepository
  ],

  exports: [
    SubscriptionPlanService,
    SubscriptionPlanRepository,
    SubscriptionPlanModuleRepository
  ],
})
export class SubscriptionPlanModule {}