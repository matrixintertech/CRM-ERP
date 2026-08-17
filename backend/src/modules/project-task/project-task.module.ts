import {
  Module,
} from "@nestjs/common";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  MyTaskController,
} from "./controllers/my-task.controller";

import {
  ProjectTaskController,
} from "./controllers/project-task.controller";

import {
  ProjectTaskRepository,
} from "./repositories/project-task.repository";

import {
  ProjectTaskService,
} from "./services/project-task.service";


@Module({
  imports: [
    AuthorizationModule,
  ],

  controllers: [
    ProjectTaskController,
    MyTaskController,
  ],

  providers: [
    ProjectTaskService,
    ProjectTaskRepository,
  ],

  exports: [
    ProjectTaskService,
    ProjectTaskRepository,
  ],
})
export class ProjectTaskModule {}