import {
  Module,
} from "@nestjs/common";

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
  controllers: [
    ProjectTaskController,
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