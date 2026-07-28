import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyAdminService } from './services/company-admin.service';
import { CompanyRepository } from './repositories/company.repository';
import { UserModule } from '../user/user.module';
import { CompanySubscriptionModule } from '../company-subscription/company-subscription.module';

@Module({
  imports: [
    PrismaModule,
      UserModule,
      CompanySubscriptionModule, 
  ],
  controllers: [
    CompanyController,
  ],
  providers: [
    CompanyService,
    CompanyAdminService,
    CompanyRepository,
  ],
  exports: [
    CompanyService,
  ],
})
export class CompanyModule {}