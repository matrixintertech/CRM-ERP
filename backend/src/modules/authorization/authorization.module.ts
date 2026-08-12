import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  AuthorizationRepository,
} from "./repositories/authorization.repository";

import {
  EffectivePermissionService,
} from "./services/effective-permission.service";

import {
  PermissionScopeService,
} from "./services/permission-scope.service";

import {
  CompanyBoundaryService,
} from "./services/company-boundary.service";

import {
  ProjectPolicy,
} from './policies/project.policy';

import {
  DepartmentPolicy,
} from './policies/department.policy';

import {
  PermissionGuard,
} from "./guards/permission.guard";

@Module({
  imports: [
    PrismaModule,
  ],

  providers: [
    AuthorizationRepository,
    EffectivePermissionService,
    PermissionScopeService,
    CompanyBoundaryService,
    PermissionGuard,
     ProjectPolicy,
     DepartmentPolicy
  ],

  exports: [
    AuthorizationRepository,
    EffectivePermissionService,
     PermissionScopeService,
     CompanyBoundaryService,
    PermissionGuard,
     ProjectPolicy,
     DepartmentPolicy
  ],
})
export class AuthorizationModule {}