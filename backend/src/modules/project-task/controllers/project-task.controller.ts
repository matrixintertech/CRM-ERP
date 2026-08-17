import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  ApiParam,
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
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
} from "../dto";

import {
  ProjectTaskService,
} from "../services/project-task.service";


interface AuthenticatedRequest
  extends Request {
  user: User;
}


@ApiTags("Project Tasks")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller(
  "projects/:projectUuid/tasks",
)
export class ProjectTaskController {
  constructor(
    private readonly projectTaskService:
      ProjectTaskService,
  ) {}


  /*
   * Manager / authorized user:
   * Create task.
   */
  @Post()
  @RequirePermission(
    "company.task.create",
  )
  @ApiOperation({
    summary:
      "Create project task",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Body()
    dto: CreateProjectTaskDto,
  ) {
    return this.projectTaskService.create(
      req.user.companyId,
      projectUuid,
      dto,
    );
  }


  /*
   * View project tasks.
   */
  @Get()
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get project tasks",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,
  ) {
    return this.projectTaskService.findAll(
      req.user.companyId,
      projectUuid,
    );
  }


  /*
   * Employee:
   * Start working on assigned task.
   *
   * Service will verify that:
   * - employee exists
   * - task belongs to company/project
   * - employee is assigned to task
   * - task can be started
   * - no OPEN work session exists
   */
  @Post(
    ":taskUuid/start-work",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Start work on assigned project task",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "taskUuid",
    description:
      "Project Task UUID",
  })
  startWork(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("taskUuid")
    taskUuid: string,
  ) {
    return this.projectTaskService.startWork(
      req.user.companyId,
      projectUuid,
      taskUuid,
      req.user.id,
      req.user.employeeId,
    );
  }


  /*
   * Employee:
   * Stop current work session.
   *
   * Task remains IN_PROGRESS.
   * Only current OPEN work session closes.
   */
  @Post(
    ":taskUuid/stop-work",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Stop work on assigned project task",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "taskUuid",
    description:
      "Project Task UUID",
  })
  stopWork(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("taskUuid")
    taskUuid: string,
  ) {
    return this.projectTaskService.stopWork(
      req.user.companyId,
      projectUuid,
      taskUuid,
      req.user.id,
      req.user.employeeId,
    );
  }


  /*
   * View task details.
   */
  @Get(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get project task details",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "taskUuid",
    description:
      "Project Task UUID",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("taskUuid")
    taskUuid: string,
  ) {
    return this.projectTaskService.findByUuid(
      req.user.companyId,
      projectUuid,
      taskUuid,
    );
  }


  /*
   * Manager / authorized user:
   * Edit planning fields.
   *
   * Employee execution should NOT
   * use this endpoint.
   */
  @Patch(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.update",
  )
  @ApiOperation({
    summary:
      "Update project task",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "taskUuid",
    description:
      "Project Task UUID",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("taskUuid")
    taskUuid: string,

    @Body()
    dto: UpdateProjectTaskDto,
  ) {
    return this.projectTaskService.updateByUuid(
      req.user.companyId,
      projectUuid,
      taskUuid,
      dto,
    );
  }


  /*
   * Manager / authorized user:
   * Delete task.
   */
  @Delete(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.delete",
  )
  @ApiOperation({
    summary:
      "Delete project task",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "taskUuid",
    description:
      "Project Task UUID",
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("taskUuid")
    taskUuid: string,
  ) {
    return this.projectTaskService.deleteByUuid(
      req.user.companyId,
      projectUuid,
      taskUuid,
    );
  }
}