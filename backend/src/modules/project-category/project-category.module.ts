import {
  Module,
} from '@nestjs/common';

import {
  PrismaModule,
} from 'src/database/prisma.module';


import {
  ProjectCategoryController,
} from './controllers/project-category.controller';


import {
  ProjectCategoryService,
} from './services/project-category.service';


import {
  ProjectCategoryRepository,
} from './repositories/project-category.repository';


@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    ProjectCategoryController,
  ],

  providers: [
    ProjectCategoryService,
    ProjectCategoryRepository,
  ],

  exports: [
    ProjectCategoryService,
    ProjectCategoryRepository,
  ],
})
export class ProjectCategoryModule {}