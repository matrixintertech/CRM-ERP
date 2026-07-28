import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionRepository } from './repositories/subscription.repository';

import { ModuleRepository } from '../module/repositories/module.repository';

@Module({
  imports: [PrismaModule],

  controllers: [
    SubscriptionController,
  ],

  providers: [
    SubscriptionService,
    SubscriptionRepository,
    ModuleRepository,
  ],

  exports: [
    SubscriptionService,
  ],
})
export class SubscriptionModule {}