import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import type {
  Request,
} from "express";

import {
  User,
} from "@prisma/client";

import {
  AssignProjectMemberDto,
  UpdateProjectMemberDto,
} from "../dto";

import {
  ProjectMemberService,
} from "../services/project-member.service";

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags("Project Members")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("projects/:projectUuid/members")
export class ProjectMemberController {
  constructor(
    private readonly projectMemberService:
      ProjectMemberService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      "Assign member to project",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  assign(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Body()
    dto: AssignProjectMemberDto,
  ) {
    return this.projectMemberService.assign(
      req.user.companyId,
      projectUuid,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      "Get project members",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiQuery({
    name: "includeHistory",
    required: false,
    type: Boolean,
    example: false,
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Query("includeHistory")
    includeHistory?: string,
  ) {
    const shouldIncludeHistory =
      includeHistory === "true";

    return this.projectMemberService.findAll(
      req.user.companyId,
      projectUuid,
      shouldIncludeHistory,
    );
  }

  @Get(":memberUuid")
  @ApiOperation({
    summary:
      "Get project member assignment",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "memberUuid",
    description:
      "Project member assignment UUID",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("memberUuid")
    memberUuid: string,
  ) {
    return this.projectMemberService.findByUuid(
      req.user.companyId,
      projectUuid,
      memberUuid,
    );
  }

  @Patch(":memberUuid")
  @ApiOperation({
    summary:
      "Update project member assignment",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "memberUuid",
    description:
      "Project member assignment UUID",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("memberUuid")
    memberUuid: string,

    @Body()
    dto: UpdateProjectMemberDto,
  ) {
    return this.projectMemberService.updateByUuid(
      req.user.companyId,
      projectUuid,
      memberUuid,
      dto,
    );
  }

  @Delete(":memberUuid")
  @ApiOperation({
    summary:
      "Remove member from project",
  })
  @ApiParam({
    name: "projectUuid",
    description:
      "Project UUID",
  })
  @ApiParam({
    name: "memberUuid",
    description:
      "Project member assignment UUID",
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param("projectUuid")
    projectUuid: string,

    @Param("memberUuid")
    memberUuid: string,
  ) {
    return this.projectMemberService.removeByUuid(
      req.user.companyId,
      projectUuid,
      memberUuid,
    );
  }
}