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
  UserController,
} from "./controllers/user.controller";

import {
  UserService,
} from "./services/user.service";

import {
  UserRepository,
} from "./repositories/user.repository";

import {
  EmployeeRepository,
} from "../employee/repositories/employee.repository";

import {
  RoleRepository,
} from "../roles/repositories/role.repository";

@Module({
  imports: [
    PrismaModule,
    AuthorizationModule,
  ],

  controllers: [
    UserController,
  ],

  providers: [
    UserService,
    UserRepository,
    EmployeeRepository,
    RoleRepository,
  ],

  exports: [
    UserService,
    UserRepository,
  ],
})
export class UserModule {}