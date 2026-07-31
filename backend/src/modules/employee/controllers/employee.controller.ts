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

import { EmployeeService } from "../services/employee.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";

@ApiTags("Employees")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("employees")
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create Employee" })
  @ApiResponse({
    status: 201,
    description: "Employee created successfully.",
  })
  async create(
    @Req() req,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(
      BigInt((req.user as any).companyId),
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get All Employees" })
  async findAll(@Req() req) {
    return this.employeeService.findAll(
      BigInt((req.user as any).companyId),
    );
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get Employee By UUID" })
  @ApiParam({
    name: "uuid",
    example: "b68b1d3f-8c27-4b8f-91d2-2f1d7b6d8c10",
  })
  async findOne(
    @Req() req,
    @Param("uuid") uuid: string,
  ) {
    return this.employeeService.findOne(
      BigInt((req.user as any).companyId),
      uuid,
    );
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update Employee" })
  async update(
    @Req() req,
    @Param("uuid") uuid: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(
      BigInt((req.user as any).companyId),
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Delete Employee" })
  async remove(
    @Req() req,
    @Param("uuid") uuid: string,
  ) {
    return this.employeeService.remove(
      BigInt((req.user as any).companyId),
      uuid,
    );
  }
}