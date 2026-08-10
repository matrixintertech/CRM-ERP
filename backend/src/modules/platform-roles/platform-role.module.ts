import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  PlatformRoleController,
} from "./controllers/platform-role.controller";

import {
  PlatformRoleService,
} from "./services/platform-role.service";

import {
  PlatformRoleRepository,
} from "./repositories/platform-role.repository";

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    PlatformRoleController,
  ],

  providers: [
    PlatformRoleService,
    PlatformRoleRepository,
  ],

  exports: [
    PlatformRoleService,
    PlatformRoleRepository,
  ],
})
export class PlatformRoleModule {}