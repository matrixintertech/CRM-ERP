import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";

import type {
  Request,
} from "express";

import type {
  User,
} from "@prisma/client";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import {
  AuthGuard,
} from "@nestjs/passport";

import {
  CreateRoleDto,
} from "../dto/create-role.dto";

import {
  UpdateRoleDto,
} from "../dto/update-role.dto";

import {
  AssignRolePermissionsDto,
} from "../dto/assign-role-permissions.dto";

import {
  RoleService,
} from "../services/role.service";

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


@ApiTags("Role")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("roles")
export class RoleController {
  constructor(
    private readonly roleService:
      RoleService,
  ) {}


  @Post()
  @RequirePermission(
    "company.role.create",
  )
  @ApiOperation({
    summary:
      "Create Role",
  })
  @ApiResponse({
    status: 201,
    description:
      "Role created successfully.",
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateRoleDto,
  ) {
    return this.roleService.create(
      req.user,
      dto,
    );
  }


  @Get()
  @RequirePermission(
    "company.role.view",
  )
  @ApiOperation({
    summary:
      "Get Roles",
  })
  @ApiResponse({
    status: 200,
    description:
      "Roles fetched successfully.",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.roleService.findAll(
      req.user,
    );
  }


  /*
   * Static routes must come before
   * dynamic :uuid routes.
   */
  @Get("dropdown")
  @RequirePermission(
    "company.role.view",
  )
  @ApiOperation({
    summary:
      "Get Active Role Dropdown",
  })
  @ApiResponse({
    status: 200,
    description:
      "Role dropdown fetched successfully.",
  })
  findDropdown(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.roleService.findDropdown(
      req.user,
    );
  }


  /*
   * Dedicated permission catalog
   * for Role Permission Management.
   *
   * Important:
   *
   * This intentionally does NOT require:
   * company.permission.view
   *
   * Assigning permissions to a role
   * is part of role management and is
   * therefore controlled by:
   *
   * company.role.update
   */
  @Get(
    "permissions/catalog",
  )
  @RequirePermission(
    "company.role.update",
  )
  @ApiOperation({
    summary:
      "Get Company Role Permission Catalog",
  })
  @ApiResponse({
    status: 200,
    description:
      "Company role permission catalog fetched successfully.",
  })
  findPermissionCatalog(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.roleService
      .findPermissionCatalog(
        req.user,
      );
  }


  /*
   * Get permissions currently
   * assigned to a role.
   *
   * This endpoint belongs to
   * role permission management,
   * so update capability is used.
   */
  @Get(
    ":uuid/permissions",
  )
  @RequirePermission(
    "company.role.update",
  )
  @ApiOperation({
    summary:
      "Get Role Permissions",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Role permissions fetched successfully.",
  })
  findRolePermissions(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,
  ) {
    return this.roleService
      .findRolePermissions(
        req.user,
        uuid,
      );
  }


  /*
   * Assign/replace role permissions
   * with scopes.
   */
  @Put(
    ":uuid/permissions",
  )
  @RequirePermission(
    "company.role.update",
  )
  @ApiOperation({
    summary:
      "Assign Role Permissions With Scope",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Permissions assigned successfully.",
  })
  assignPermissions(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,

    @Body()
    dto:
      AssignRolePermissionsDto,
  ) {
    return this.roleService
      .assignPermissions(
        req.user,
        uuid,
        dto,
      );
  }


  @Get(
    ":uuid",
  )
  @RequirePermission(
    "company.role.view",
  )
  @ApiOperation({
    summary:
      "Get Role By UUID",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Role fetched successfully.",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,
  ) {
    return this.roleService.findOne(
      req.user,
      uuid,
    );
  }


  @Patch(
    ":uuid",
  )
  @RequirePermission(
    "company.role.update",
  )
  @ApiOperation({
    summary:
      "Update Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Role updated successfully.",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,

    @Body()
    dto: UpdateRoleDto,
  ) {
    return this.roleService.update(
      req.user,
      uuid,
      dto,
    );
  }


  @Delete(
    ":uuid",
  )
  @RequirePermission(
    "company.role.delete",
  )
  @ApiOperation({
    summary:
      "Delete Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Role deleted successfully.",
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,
  ) {
    return this.roleService.delete(
      req.user,
      uuid,
    );
  }
}