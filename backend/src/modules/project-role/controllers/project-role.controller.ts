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

import type {
  User,
} from "@prisma/client";

import {
  CreateProjectRoleDto,
  UpdateProjectRoleDto,
} from "../dto";

import {
  ProjectRoleService,
} from "../services/project-role.service";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags("Project Roles")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("project-roles")
export class ProjectRoleController {
  constructor(
    private readonly projectRoleService:
      ProjectRoleService,
  ) {}

  @Post()
  @RequirePermission(
    "company.project_role.create",
  )
  @ApiOperation({
    summary:
      "Create Project Role",
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateProjectRoleDto,
  ) {
    return this.projectRoleService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    "company.project_role.view",
  )
  @ApiOperation({
    summary:
      "Get Project Roles",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.projectRoleService.findAll(
      req.user,
    );
  }

  @Get(":uuid")
  @RequirePermission(
    "company.project_role.view",
  )
  @ApiOperation({
    summary:
      "Get Project Role",
  })
  @ApiParam({
    name: "uuid",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,
  ) {
    return this.projectRoleService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(":uuid")
  @RequirePermission(
    "company.project_role.update",
  )
  @ApiOperation({
    summary:
      "Update Project Role",
  })
  @ApiParam({
    name: "uuid",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,

    @Body()
    dto: UpdateProjectRoleDto,
  ) {
    return this.projectRoleService.updateByUuid(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @RequirePermission(
    "company.project_role.delete",
  )
  @ApiOperation({
    summary:
      "Delete Project Role",
  })
  @ApiParam({
    name: "uuid",
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,
  ) {
    return this.projectRoleService.deleteByUuid(
      req.user,
      uuid,
    );
  }
}