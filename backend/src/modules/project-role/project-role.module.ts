import {
  Module,
} from "@nestjs/common";

import {
  ProjectRoleController,
} from "./controllers/project-role.controller";

import {
  ProjectRoleRepository,
} from "./repositories/project-role.repository";

import {
  ProjectRoleService,
} from "./services/project-role.service";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

@Module({
  imports: [
    AuthorizationModule,
  ],

  controllers: [
    ProjectRoleController,
  ],

  providers: [
    ProjectRoleService,
    ProjectRoleRepository,
  ],

  exports: [
    ProjectRoleService,
    ProjectRoleRepository,
  ],
})
export class ProjectRoleModule {}