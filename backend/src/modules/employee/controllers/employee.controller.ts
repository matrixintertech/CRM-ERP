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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { AuthGuard } from "@nestjs/passport";

import type { Request } from "express";
import type { User } from "@prisma/client";

import { EmployeeService } from "../services/employee.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags("Employees")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("employees")
export class EmployeeController {
  constructor(
    private readonly employeeService:
      EmployeeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create Employee",
  })
  @ApiResponse({
    status: 201,
    description:
      "Employee created successfully.",
  })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(
      req.user.companyId!,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: "Get All Employees",
  })
  @ApiResponse({
    status: 200,
    description:
      "Employees fetched successfully.",
  })
  findAll(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.employeeService.findAll(
      req.user.companyId!,
    );
  }

  @Get(":uuid")
  @ApiOperation({
    summary: "Get Employee By UUID",
  })
  @ApiParam({
    name: "uuid",
    type: String,
    example:
      "b68b1d3f-8c27-4b8f-91d2-2f1d7b6d8c10",
  })
  @ApiResponse({
    status: 200,
    description:
      "Employee fetched successfully.",
  })
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param("uuid") uuid: string,
  ) {
    return this.employeeService.findOne(
      req.user.companyId!,
      uuid,
    );
  }

  @Patch(":uuid")
  @ApiOperation({
    summary: "Update Employee",
  })
  @ApiParam({
    name: "uuid",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Employee updated successfully.",
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param("uuid") uuid: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(
      req.user.companyId!,
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @ApiOperation({
    summary: "Delete Employee",
  })
  @ApiParam({
    name: "uuid",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Employee deleted successfully.",
  })
  remove(
    @Req() req: AuthenticatedRequest,
    @Param("uuid") uuid: string,
  ) {
    return this.employeeService.remove(
      req.user.companyId!,
      uuid,
    );
  }
}