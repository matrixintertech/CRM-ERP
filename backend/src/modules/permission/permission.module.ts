import { Module } from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  PermissionController,
} from "./controllers/permission.controller";

import {
  PermissionService,
} from "./services/permission.service";

import {
  PermissionRepository,
} from "./repositories/permission.repository";


@Module({
  imports: [
    PrismaModule,

    AuthorizationModule,
  ],

  controllers: [
    PermissionController,
  ],

  providers: [
    PermissionService,
    PermissionRepository,
  ],

  exports: [
    PermissionService,
    PermissionRepository,
  ],
})
export class PermissionModule {}