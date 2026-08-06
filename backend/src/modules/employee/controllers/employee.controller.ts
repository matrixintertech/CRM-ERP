import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import type { Request } from 'express';
import { UserType, type User } from '@prisma/client';

import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('Employees')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  private getCompanyId(user: User): bigint {
    if (!user.companyId) {
      throw new ForbiddenException('Company context is missing.');
    }

    return user.companyId;
  }

  @Post()
  @ApiOperation({
    summary: 'Create Employee',
  })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully.',
  })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(this.getCompanyId(req.user), dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Employees',
  })
  @ApiResponse({
    status: 200,
    description: 'Employees fetched successfully.',
  })
  findAll(@Req() req: AuthenticatedRequest) {
    const companyId =
      req.user.userType === UserType.PLATFORM_OWNER
        ? undefined
        : this.getCompanyId(req.user);

    return this.employeeService.findAll(companyId);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get Employee By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
    example: 'b68b1d3f-8c27-4b8f-91d2-2f1d7b6d8c10',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee fetched successfully.',
  })
  findOne(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.employeeService.findOne(this.getCompanyId(req.user), uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update Employee',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully.',
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(this.getCompanyId(req.user), uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Employee',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee deleted successfully.',
  })
  remove(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.employeeService.remove(this.getCompanyId(req.user), uuid);
  }
}
