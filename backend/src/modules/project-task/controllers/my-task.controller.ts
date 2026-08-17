import {
  Controller,
  Get,
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
  ) {}


  /*
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
}