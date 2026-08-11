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
  PermissionGuard,
} from "./guards/permission.guard";

@Module({
  imports: [
    PrismaModule,
  ],

  providers: [
    AuthorizationRepository,
    EffectivePermissionService,
    PermissionGuard,
  ],

  exports: [
    AuthorizationRepository,
    EffectivePermissionService,
    PermissionGuard,
  ],
})
export class AuthorizationModule {}