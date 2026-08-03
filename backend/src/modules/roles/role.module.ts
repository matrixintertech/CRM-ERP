import { Module } from "@nestjs/common";

import { PrismaModule } from "src/database/prisma.module";

import { RoleController } from "./controllers/role.controller";
import { RoleRepository } from "./repositories/role.repository";
import { RoleService } from "./services/role.service";

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    RoleController,
  ],

  providers: [
    RoleService,
    RoleRepository,
  ],

  exports: [
    RoleService,
    RoleRepository,
  ],
})
export class RoleModule {}