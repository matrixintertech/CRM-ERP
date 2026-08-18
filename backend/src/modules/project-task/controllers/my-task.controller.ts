import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  AuthGuard,
} from "@nestjs/passport";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import type {
  Request,
} from "express";

import {
  User,
} from "@prisma/client";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

import {
  CreateProjectTaskReportUploadDto,
} from "../dto/create-project-task-report-upload.dto";

import {
  ProjectTaskReportAttachmentService,
} from "../services/project-task-report-attachment.service";

import {
  ProjectTaskService,
} from "../services/project-task.service";


interface AuthenticatedRequest
  extends Request {
  user: User;
}


@ApiTags("My Tasks")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("my/tasks")
export class MyTaskController {
  constructor(
    private readonly projectTaskService:
      ProjectTaskService,

    private readonly projectTaskReportAttachmentService:
      ProjectTaskReportAttachmentService,
  ) {}


  /*
   * =========================================================
   * MY ASSIGNED TASKS
   * =========================================================
   *
   * Logged-in employee ke
   * assigned tasks across all projects.
   *
   * Permission:
   * company.task.view
   *
   * Ownership:
   * repository/service ensures
   * assigned employee === current employee.
   */
  @Get()
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get logged-in employee assigned tasks",
  })
  findMyTasks(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.projectTaskService.findMyTasks(
      req.user.companyId,
      req.user.employeeId,
    );
  }


  /*
   * =========================================================
   * CREATE TASK REPORT IMAGE UPLOAD URL
   * =========================================================
   *
   * Flow:
   *
   * 1. Employee selects / captures image
   * 2. Frontend sends metadata here
   * 3. Backend verifies employee owns task
   * 4. Backend creates safe storage key
   * 5. Backend returns presigned PUT URL
   * 6. Frontend uploads image directly to R2/S3
   *
   * Permission:
   * company.task.execute
   *
   * Scope:
   * OWN
   *
   * Actual task ownership is enforced
   * inside ProjectTaskReportAttachmentService.
   */
  @Post(
    ":taskUuid/report-attachments/upload-url",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Create presigned image upload URL for task report evidence",
  })
createReportAttachmentUploadUrl(
  @Param(
    "taskUuid",
  )
  taskUuid: string,

  @Body()
  dto:
    CreateProjectTaskReportUploadDto,

  @Req()
  req:
    AuthenticatedRequest,
) {
  const companyId =
    req.user.companyId;


  if (!companyId) {
    throw new ForbiddenException(
      "Company context is required.",
    );
  }


  return this
    .projectTaskReportAttachmentService
    .createImageUpload(
      companyId,
      taskUuid,
      req.user.employeeId,
      dto,
    );
}
}