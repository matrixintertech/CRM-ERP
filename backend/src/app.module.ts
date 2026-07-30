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

// Onboarding
import { OnboardingModule } from './modules/onboarding/onboarding.module';

//Organisation Module
import { OrganizationUnitModule } from './modules/organization-unit/organization-unit.module';

//Role Module
import { RoleModule } from './modules/roles/role.module';

//Permission Module
import { PermissionModule } from "./modules/permission/permission.module";

//Module Option
import { ModuleModule } from './modules/module/module.module';

//Subscription
import { SubscriptionModule } from './modules/subscriptions/subscription.module';

//States
import { StateModule } from "./modules/master/state/state.module";

//City
import { CityModule } from "./modules/master/city/city.module";

//Client
import { ClientModule } from './modules/client/client.module';

//Project
import { ProjectModule } from './modules/project/project.module';


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
    OnboardingModule,
    OrganizationUnitModule,
    RoleModule,
    PermissionModule,
    ModuleModule,
    SubscriptionModule,
    StateModule,
    CityModule,
    ClientModule,
    ProjectModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}