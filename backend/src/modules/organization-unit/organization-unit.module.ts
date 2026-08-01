import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { CompanyModule } from '../company/company.module';
import { AuthModule } from '../auth/auth.module';


import { OrganizationUnitController } from './controllers/organization-unit.controller';
import { OrganizationUnitRepository } from './repositories/organization-unit.repository';
import { OrganizationUnitService } from './services/organization-unit.service';

import { StateRepository } from "../master/state/repositories/state.repository";
import { CityRepository } from "../master/city/repositories/city.repository";

@Module({
  imports: [PrismaModule, CompanyModule, AuthModule],

  controllers: [
    OrganizationUnitController,
  ],

  providers: [
    OrganizationUnitService,
    OrganizationUnitRepository,
     StateRepository,
  CityRepository,
  ],

  exports: [OrganizationUnitRepository,OrganizationUnitService],
})
export class OrganizationUnitModule {}