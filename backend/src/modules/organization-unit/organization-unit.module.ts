import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { OrganizationUnitController } from './controllers/organization-unit.controller';
import { OrganizationUnitRepository } from './repositories/organization-unit.repository';
import { OrganizationUnitService } from './services/organization-unit.service';

@Module({
  imports: [PrismaModule],

  controllers: [
    OrganizationUnitController,
  ],

  providers: [
    OrganizationUnitService,
    OrganizationUnitRepository,
  ],

  exports: [OrganizationUnitService],
})
export class OrganizationUnitModule {}