import { Module } from '@nestjs/common';

import { CompanyModule } from 'src/modules/company/company.module';
import { CompanySubscriptionModule } from 'src/modules/company-subscription/company-subscription.module';
import { UserModule } from 'src/modules/user/user.module';

import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingService } from './services/onboarding.service';

@Module({
  imports: [
    CompanyModule,
    CompanySubscriptionModule,
    UserModule,
  ],
  controllers: [
    OnboardingController,
  ],
  providers: [
    OnboardingService,
  ],
})
export class OnboardingModule {}