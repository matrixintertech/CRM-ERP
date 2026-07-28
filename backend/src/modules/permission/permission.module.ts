import { Module } from "@nestjs/common";

import { PrismaModule } from 'src/database/prisma.module';

import { PermissionController } from "./controllers/permission.controller";
import { PermissionService } from "./services/permission.service";
import { PermissionRepository } from "./repositories/permission.repository";

@Module({
  imports: [PrismaModule],

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