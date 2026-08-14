import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  ModuleController,
} from "./controllers/module.controller";

import {
  ModuleService,
} from "./services/module.service";

import {
  ModuleRepository,
} from "./repositories/module.repository";


@Module({
  imports: [
    PrismaModule,
    AuthorizationModule,
  ],

  controllers: [
    ModuleController,
  ],

  providers: [
    ModuleService,
    ModuleRepository,
  ],

  exports: [
    ModuleService,
    ModuleRepository,
  ],
})
export class ModuleModule {}