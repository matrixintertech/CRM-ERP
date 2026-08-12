import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  OrganizationUnitModule,
} from "../organization-unit/organization-unit.module";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  DepartmentController,
} from "./controllers/department.controller";

import {
  DepartmentRepository,
} from "./repositories/department.repository";

import {
  DepartmentService,
} from "./services/department.service";

@Module({
  imports: [
    PrismaModule,
    OrganizationUnitModule,
    AuthorizationModule,
  ],

  controllers: [
    DepartmentController,
  ],

  providers: [
    DepartmentRepository,
    DepartmentService,
  ],

  exports: [
    DepartmentRepository,
    DepartmentService,
  ],
})
export class DepartmentModule {}