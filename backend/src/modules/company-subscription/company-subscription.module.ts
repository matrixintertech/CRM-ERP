import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { CompanySubscriptionController } from './controllers/company-subscription.controller';
import { CompanySubscriptionService } from './services/company-subscription.service';
import { CompanySubscriptionRepository } from './repositories/company-subscription.repository';

@Module({
  imports: [PrismaModule],

  controllers: [
    CompanySubscriptionController,
  ],

  providers: [
    CompanySubscriptionService,
    CompanySubscriptionRepository,
  ],

  exports: [
    CompanySubscriptionService,
  ],
})
export class CompanySubscriptionModule {}