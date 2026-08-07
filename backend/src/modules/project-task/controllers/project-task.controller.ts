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
@UseGuards(AuthGuard("jwt"))
@Controller("projects/:projectUuid/tasks")
export class ProjectTaskController {
  constructor(
    private readonly projectTaskService:
      ProjectTaskService,
  ) {}

  @Post()
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

  @Get()
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

  @Get(":taskUuid")
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

  @Patch(":taskUuid")
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

  @Delete(":taskUuid")
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