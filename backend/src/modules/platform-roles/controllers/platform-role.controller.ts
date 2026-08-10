import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import {
  AuthGuard,
} from "@nestjs/passport";

import type {
  Request,
} from "express";

import {
  Status,
  UserType,
} from "@prisma/client";

import {
  PlatformRoleService,
} from "../services/platform-role.service";

import {
  CreatePlatformRoleDto,
} from "../dto/create-platform-role.dto";

import {
  UpdatePlatformRoleDto,
} from "../dto/update-platform-role.dto";

import {
  AssignPlatformRolePermissionsDto,
} from "../dto/assign-platform-role-permissions.dto";

interface AuthenticatedUser {
  sub: string;

  userType:
    UserType;
}

interface AuthenticatedRequest
  extends Request {
  user?:
    AuthenticatedUser;
}

@ApiTags(
  "Platform Roles",
)
@ApiBearerAuth(
  "access-token",
)
@UseGuards(
  AuthGuard("jwt"),
)
@Controller(
  "platform-roles",
)
export class PlatformRoleController {
  constructor(
    private readonly platformRoleService:
      PlatformRoleService,
  ) {}

  /*
   * Create platform role.
   */
  @Post()
  @ApiOperation({
    summary:
      "Create Platform Role",
  })
  create(
    @Req()
    req:
      AuthenticatedRequest,

    @Body()
    dto:
      CreatePlatformRoleDto,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .create(
        dto,
      );
  }

  /*
   * Get all platform roles.
   */
  @Get()
  @ApiOperation({
    summary:
      "Get Platform Roles",
  })
  @ApiQuery({
    name:
      "status",

    required:
      false,

    enum:
      Status,
  })
  @ApiQuery({
    name:
      "search",

    required:
      false,

    type:
      String,
  })
  findAll(
    @Req()
    req:
      AuthenticatedRequest,

    @Query(
      "status",
    )
    status?:
      Status,

    @Query(
      "search",
    )
    search?:
      string,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .findAll({
        status,

        search,
      });
  }

  /*
   * Active platform roles dropdown.
   *
   * Static route ko :uuid se pehle rakho.
   */
  @Get(
    "dropdown",
  )
  @ApiOperation({
    summary:
      "Get Platform Role Dropdown",
  })
  findDropdown(
    @Req()
    req:
      AuthenticatedRequest,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .findDropdown();
  }

  /*
   * Get permissions assigned
   * to a platform role.
   *
   * Nested route ko :uuid details
   * route se pehle rakho.
   */
  @Get(
    ":uuid/permissions",
  )
  @ApiOperation({
    summary:
      "Get Platform Role Permissions",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  findPermissions(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .findPermissions(
        uuid,
      );
  }

  /*
   * Replace PLATFORM permissions
   * assigned to role.
   */
  @Put(
    ":uuid/permissions",
  )
  @ApiOperation({
    summary:
      "Assign Permissions To Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  assignPermissions(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,

    @Body()
    dto:
      AssignPlatformRolePermissionsDto,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .assignPermissions(
        uuid,
        dto,
      );
  }

  /*
   * Get one platform role.
   */
  @Get(
    ":uuid",
  )
  @ApiOperation({
    summary:
      "Get Platform Role By UUID",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  findByUuid(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .findByUuid(
        uuid,
      );
  }

  /*
   * Update platform role.
   */
  @Patch(
    ":uuid",
  )
  @ApiOperation({
    summary:
      "Update Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  update(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,

    @Body()
    dto:
      UpdatePlatformRoleDto,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .update(
        uuid,
        dto,
      );
  }

  /*
   * Soft delete platform role.
   */
  @Delete(
    ":uuid",
  )
  @ApiOperation({
    summary:
      "Delete Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  remove(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    this.ensurePlatformOwner(
      req,
    );

    return this.platformRoleService
      .remove(
        uuid,
      );
  }

  /*
   * Temporary platform boundary.
   *
   * Later:
   * @RequirePermission(...)
   * PlatformPermissionGuard
   * se replace karenge.
   */
  private ensurePlatformOwner(
    req:
      AuthenticatedRequest,
  ): void {
    if (
      !req.user
    ) {
      throw new ForbiddenException(
        "Authenticated user not found.",
      );
    }

    if (
      req.user.userType !==
      UserType.PLATFORM_OWNER
    ) {
      throw new ForbiddenException(
        "Platform access is required.",
      );
    }
  }
}