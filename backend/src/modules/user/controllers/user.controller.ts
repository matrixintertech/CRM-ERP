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
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import {
  AuthGuard,
} from "@nestjs/passport";

import type {
  Request,
} from "express";

import type {
  User,
} from "@prisma/client";

import {
  UserService,
} from "../services/user.service";

import {
  CreateEmployeeUserAccountDto,
} from "../dto/create-employee-user-account.dto";

import {
  UpdateEmployeeUserAccountDto,
} from "../dto/update-employee-user-account.dto";

import {
  UserQueryDto,
} from "../dto/user-query.dto";

import {
  AssignUserPermissionsDto,
} from "../dto/assign-user-permissions.dto";

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

@ApiTags("Users")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("users")
export class UserController {
  constructor(
    private readonly userService:
      UserService,
  ) {}

  /*
   * Employee user account routes.
   *
   * Static/nested routes must stay
   * before :userUuid.
   */

  @Post(
    "employees/:employeeUuid",
  )
  @RequirePermission(
    "company.user.create",
  )
  @ApiOperation({
    summary:
      "Create Employee User Account",
  })
  @ApiParam({
    name:
      "employeeUuid",
    type:
      String,
  })
  createEmployeeUserAccount(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "employeeUuid",
      ParseUUIDPipe,
    )
    employeeUuid:
      string,

    @Body()
    dto:
      CreateEmployeeUserAccountDto,
  ) {
    return this.userService
      .createEmployeeUserAccount(
        req.user,
        employeeUuid,
        dto,
      );
  }

  @Get(
    "employees/:employeeUuid",
  )
  @RequirePermission(
    "company.user.view",
  )
  @ApiOperation({
    summary:
      "Get Employee User Account",
  })
  @ApiParam({
    name:
      "employeeUuid",
    type:
      String,
  })
  findEmployeeUserAccount(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "employeeUuid",
      ParseUUIDPipe,
    )
    employeeUuid:
      string,
  ) {
    return this.userService
      .findEmployeeUserAccount(
        req.user,
        employeeUuid,
      );
  }

  @Patch(
    "employees/:employeeUuid",
  )
  @RequirePermission(
    "company.user.update",
  )
  @ApiOperation({
    summary:
      "Update Employee User Account",
  })
  @ApiParam({
    name:
      "employeeUuid",
    type:
      String,
  })
  updateEmployeeUserAccount(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "employeeUuid",
      ParseUUIDPipe,
    )
    employeeUuid:
      string,

    @Body()
    dto:
      UpdateEmployeeUserAccountDto,
  ) {
    return this.userService
      .updateEmployeeUserAccount(
        req.user,
        employeeUuid,
        dto,
      );
  }

  @Delete(
    "employees/:employeeUuid",
  )
  @RequirePermission(
    "company.user.delete",
  )
  @ApiOperation({
    summary:
      "Delete Employee User Account",
  })
  @ApiParam({
    name:
      "employeeUuid",
    type:
      String,
  })
  deleteEmployeeUserAccount(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "employeeUuid",
      ParseUUIDPipe,
    )
    employeeUuid:
      string,
  ) {
    return this.userService
      .deleteEmployeeUserAccount(
        req.user,
        employeeUuid,
      );
  }

  /*
   * User listing.
   */

  @Get()
  @RequirePermission(
    "company.user.view",
  )
  @ApiOperation({
    summary:
      "Get Users",
  })
  findAll(
    @Req()
    req:
      AuthenticatedRequest,

    @Query()
    query:
      UserQueryDto,
  ) {
    return this.userService
      .findAll(
        req.user,
        query,
      );
  }

  /*
   * Additional user permissions.
   *
   * Must stay before :userUuid.
   */

  @Get(
    ":userUuid/permissions",
  )
  @RequirePermission(
    "company.user.view",
  )
  @ApiOperation({
    summary:
      "Get Additional User Permissions",
  })
  @ApiParam({
    name:
      "userUuid",
    type:
      String,
  })
  findPermissions(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "userUuid",
      ParseUUIDPipe,
    )
    userUuid:
      string,
  ) {
    return this.userService
      .findPermissions(
        req.user,
        userUuid,
      );
  }

  @Put(
    ":userUuid/permissions",
  )
  @RequirePermission(
    "company.user.update",
  )
  @ApiOperation({
    summary:
      "Assign Additional Permissions To User",
  })
  @ApiParam({
    name:
      "userUuid",
    type:
      String,
  })
  updatePermissions(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "userUuid",
      ParseUUIDPipe,
    )
    userUuid:
      string,

    @Body()
    dto:
      AssignUserPermissionsDto,
  ) {
    return this.userService
      .updatePermissions(
        req.user,
        userUuid,
        dto,
      );
  }

  /*
   * User details.
   *
   * Dynamic route must remain last.
   */

  @Get(
    ":userUuid",
  )
  @RequirePermission(
    "company.user.view",
  )
  @ApiOperation({
    summary:
      "Get User By UUID",
  })
  @ApiParam({
    name:
      "userUuid",
    type:
      String,
  })
  findByUuid(
    @Req()
    req:
      AuthenticatedRequest,

    @Param(
      "userUuid",
      ParseUUIDPipe,
    )
    userUuid:
      string,
  ) {
    return this.userService
      .findByUuid(
        req.user,
        userUuid,
      );
  }
}