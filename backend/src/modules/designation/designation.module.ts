import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  DepartmentModule,
} from "../department/department.module";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  DesignationController,
} from "./controllers/designation.controller";

import {
  DesignationRepository,
} from "./repositories/designation.repository";

import {
  DesignationService,
} from "./services/designation.service";

@Module({
  imports: [
    PrismaModule,
    DepartmentModule,
    AuthorizationModule,
  ],

  controllers: [
    DesignationController,
  ],

  providers: [
    DesignationRepository,
    DesignationService,
  ],

  exports: [
    DesignationRepository,
    DesignationService,
  ],
})
export class DesignationModule {}