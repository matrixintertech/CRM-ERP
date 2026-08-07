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
  CreateProjectRoleDto,
  UpdateProjectRoleDto,
} from "../dto";

import {
  ProjectRoleService,
} from "../services/project-role.service";

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags("Project Roles")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("project-roles")
export class ProjectRoleController {
  constructor(
    private readonly projectRoleService:
      ProjectRoleService,
  ) {}

  @Post()
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
      req.user.companyId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      "Get Project Roles",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.projectRoleService.findAll(
      req.user.companyId ??
        undefined,
    );
  }

  @Get(":uuid")
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
      req.user.companyId ??
        undefined,

      uuid,
    );
  }

  @Patch(":uuid")
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
      req.user.companyId,
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
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
      req.user.companyId,
      uuid,
    );
  }
}