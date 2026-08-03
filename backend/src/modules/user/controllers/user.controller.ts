import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  AuthGuard,
} from "@nestjs/passport";

import type {
  Request,
} from "express";

import {
  UserService,
} from "../services/user.service";

import {
  CreateEmployeeUserAccountDto,
} from "../dto/create-employee-user-account.dto";

import {
  UpdateEmployeeUserAccountDto,
} from "../dto/update-employee-user-account.dto";

interface AuthenticatedUser {
  sub: string;
  companyId?: string | number | bigint;
  userType: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@ApiTags("Users")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("users")
export class UserController {
  constructor(
    private readonly userService:
      UserService,
  ) {}

  @Post("employees/:employeeUuid")
  @ApiOperation({
    summary:
      "Create Employee User Account",
  })
  createEmployeeUserAccount(
    @Req()
    req: AuthenticatedRequest,

    @Param("employeeUuid")
    employeeUuid: string,

    @Body()
    dto: CreateEmployeeUserAccountDto,
  ) {
    return this.userService.createEmployeeUserAccount(
      this.getCompanyId(req),
      employeeUuid,
      dto,
    );
  }

  @Get("employees/:employeeUuid")
  @ApiOperation({
    summary:
      "Get Employee User Account",
  })
  findEmployeeUserAccount(
    @Req()
    req: AuthenticatedRequest,

    @Param("employeeUuid")
    employeeUuid: string,
  ) {
    return this.userService.findEmployeeUserAccount(
      this.getCompanyId(req),
      employeeUuid,
    );
  }

  @Patch("employees/:employeeUuid")
  @ApiOperation({
    summary:
      "Update Employee User Account",
  })
  updateEmployeeUserAccount(
    @Req()
    req: AuthenticatedRequest,

    @Param("employeeUuid")
    employeeUuid: string,

    @Body()
    dto: UpdateEmployeeUserAccountDto,
  ) {
    return this.userService.updateEmployeeUserAccount(
      this.getCompanyId(req),
      employeeUuid,
      dto,
    );
  }

  @Delete("employees/:employeeUuid")
  @ApiOperation({
    summary:
      "Delete Employee User Account",
  })
  deleteEmployeeUserAccount(
    @Req()
    req: AuthenticatedRequest,

    @Param("employeeUuid")
    employeeUuid: string,
  ) {
    return this.userService.deleteEmployeeUserAccount(
      this.getCompanyId(req),
      employeeUuid,
    );
  }

  private getCompanyId(
    req: AuthenticatedRequest,
  ): bigint {
    const companyId =
      req.user?.companyId;

    if (
      companyId === undefined ||
      companyId === null
    ) {
      throw new UnauthorizedException(
        "Company context not found in access token.",
      );
    }

    return BigInt(companyId);
  }
}