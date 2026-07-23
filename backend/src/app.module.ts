import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { LoggerModule } from './common/logger/logger.module';

import { HealthModule } from './modules/health/health.module';

// Auth
import { AuthModule } from './modules/auth/auth.module';

//Company
import { CompanyModule } from './modules/company/company.module';

//Subscription
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';

//Company Subscription 
import { CompanySubscriptionModule } from './modules/company-subscription/company-subscription.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    LoggerModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    CompanyModule,
    SubscriptionPlanModule,
    CompanySubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}