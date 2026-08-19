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
   * Permission:
   * company.task.execute
   *
   * Scope:
   * OWN
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


  /*
   * =========================================================
   * GET TASK REPORT ATTACHMENT VIEW URL
   * =========================================================
   *
   * Private R2/S3 object ke liye
   * temporary signed GET URL.
   *
   * Permission:
   * company.task.view
   *
   * Ownership:
   * service confirms attachment belongs
   * to current employee's assigned task.
   */
  @Get(
    ":taskUuid/report-attachments/:attachmentUuid/view-url",
  )
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get temporary view URL for task report attachment",
  })
  getReportAttachmentViewUrl(
    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Param(
      "attachmentUuid",
    )
    attachmentUuid: string,

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
      .getAttachmentViewUrl(
        companyId,
        taskUuid,
        req.user.employeeId,
        attachmentUuid,
      );
  }
}