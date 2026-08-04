import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { ClientRepository } from 'src/modules/client/repositories/client.repository';
import { CityRepository } from 'src/modules/master/city/repositories/city.repository';
import { StateRepository } from 'src/modules/master/state/repositories/state.repository';

import { CompanyModule } from 'src/modules/company/company.module';

import {
  ProjectCategoryModule,
} from 'src/modules/project-category/project-category.module';


import {
  OrganizationUnitModule,
} from 'src/modules/organization-unit/organization-unit.module';

import { ProjectController } from './controllers/project.controller';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectService } from './services/project.service';

@Module({
  imports: [PrismaModule, CompanyModule, ProjectCategoryModule,

    OrganizationUnitModule],

  controllers: [ProjectController],

  providers: [
    ProjectService,

    ProjectRepository,

    ClientRepository,
    StateRepository,
    CityRepository,
  ],

  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}