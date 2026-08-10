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
  UnauthorizedException,
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

import {
  UserType,
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

interface AuthenticatedUser {
  sub: string;

  companyId?:
    | string
    | number
    | bigint;

  userType:
    UserType;
}

interface AuthenticatedRequest
  extends Request {
  user?:
    AuthenticatedUser;
}

@ApiTags("Users")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
)
@Controller("users")
export class UserController {
  constructor(
    private readonly userService:
      UserService,
  ) {}

  /*
   * Keep employee-specific routes
   * before dynamic :userUuid routes.
   */

  @Post(
    "employees/:employeeUuid",
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
        this.getRequiredCompanyId(
          req,
        ),

        employeeUuid,

        dto,
      );
  }

  @Get(
    "employees/:employeeUuid",
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
        this.getRequiredCompanyId(
          req,
        ),

        employeeUuid,
      );
  }

  @Patch(
    "employees/:employeeUuid",
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
        this.getRequiredCompanyId(
          req,
        ),

        employeeUuid,

        dto,
      );
  }

  @Delete(
    "employees/:employeeUuid",
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
        this.getRequiredCompanyId(
          req,
        ),

        employeeUuid,
      );
  }

  /*
   * Server-side user listing:
   *
   * page
   * limit
   * search
   * status
   * userType
   * roleUuid
   * sortBy
   * sortOrder
   */

  @Get()
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
        this.getCompanyFilterId(
          req,
        ),

        query,
      );
  }

  /*
   * User additional permissions.
   *
   * Nested routes ko :userUuid
   * details route se pehle rakho.
   */

  @Get(
    ":userUuid/permissions",
  )
  @ApiOperation({
    summary:
      "Assign Additional Permissions With Scope To User",
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
        this.getCompanyFilterId(
          req,
        ),

        userUuid,
      );
  }

  @Put(
    ":userUuid/permissions",
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
        this.getCompanyFilterId(
          req,
        ),

        userUuid,

        dto,
      );
  }

  /*
   * User details.
   *
   * Dynamic route ko static/nested
   * routes ke baad rakho.
   */

  @Get(
    ":userUuid",
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
        this.getCompanyFilterId(
          req,
        ),

        userUuid,
      );
  }

  /*
   * Employee login account actions
   * always require a company context.
   */
  private getRequiredCompanyId(
    req:
      AuthenticatedRequest,
  ): bigint {
    const companyId =
      req.user?.companyId;

    if (
      companyId ===
        undefined ||
      companyId ===
        null
    ) {
      throw new UnauthorizedException(
        "Company context not found in access token.",
      );
    }

    return BigInt(
      companyId,
    );
  }

  /*
   * Company users:
   * returns their company ID.
   *
   * Platform owner:
   * returns null so repository can
   * query across companies.
   */
  private getCompanyFilterId(
    req:
      AuthenticatedRequest,
  ): bigint | null {
    const user =
      req.user;

    if (!user) {
      throw new UnauthorizedException(
        "Authenticated user not found.",
      );
    }

    if (
      user.userType ===
      UserType.PLATFORM_OWNER
    ) {
      return null;
    }

    if (
      user.companyId ===
        undefined ||
      user.companyId ===
        null
    ) {
      throw new UnauthorizedException(
        "Company context not found in access token.",
      );
    }

    return BigInt(
      user.companyId,
    );
  }
}