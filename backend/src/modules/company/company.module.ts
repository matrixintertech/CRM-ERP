import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyRepository } from './repositories/company.repository';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    CompanyController,
  ],
  providers: [
    CompanyService,
    CompanyRepository,
  ],
  exports: [
    CompanyService,
  ],
})
export class CompanyModule {}