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

import type { Request } from 'express';

import { UserType, type User } from '@prisma/client';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import { CreateDepartmentDto } from '../dto/create-department.dto';

import { UpdateDepartmentDto } from '../dto/update-department.dto';

import { DepartmentService } from '../services/department.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('Department')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  private getCompanyId(user: User): bigint {
    if (!user.companyId) {
      throw new ForbiddenException('Company context is missing.');
    }

    return user.companyId;
  }

  @Post()
  @ApiOperation({
    summary: 'Create Department',
  })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully.',
  })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(this.getCompanyId(req.user), dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Departments',
  })
  @ApiResponse({
    status: 200,
    description: 'Departments fetched successfully.',
  })
  findAll(@Req() req: AuthenticatedRequest) {
    const companyId =
      req.user.userType === UserType.PLATFORM_OWNER
        ? undefined
        : this.getCompanyId(req.user);

    return this.departmentService.findAll(companyId);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get Department By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Department fetched successfully.',
  })
  findOne(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.departmentService.findByUuid(this.getCompanyId(req.user), uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update Department',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully.',
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateByUuid(
      this.getCompanyId(req.user),
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Department',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Department deleted successfully.',
  })
  remove(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.departmentService.deleteByUuid(
      this.getCompanyId(req.user),
      uuid,
    );
  }
}
