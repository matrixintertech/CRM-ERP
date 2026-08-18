import {
  Module,
} from "@nestjs/common";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  StorageModule,
} from "../storage/storage.module";

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
  ProjectTaskReportAttachmentService,
} from "./services/project-task-report-attachment.service";

import {
  ProjectTaskService,
} from "./services/project-task.service";


@Module({
  imports: [
    AuthorizationModule,
    StorageModule,
  ],

  controllers: [
    ProjectTaskController,
    MyTaskController,
  ],

  providers: [
    ProjectTaskService,
    ProjectTaskRepository,
    ProjectTaskReportAttachmentService,
  ],

  exports: [
    ProjectTaskService,
    ProjectTaskRepository,
    ProjectTaskReportAttachmentService,
  ],
})
export class ProjectTaskModule {}