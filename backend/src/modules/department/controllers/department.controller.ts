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
} from '@nestjs/common';

import type {
  Request,
} from 'express';

import type {
  User,
} from '@prisma/client';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  CreateDepartmentDto,
} from '../dto/create-department.dto';

import {
  UpdateDepartmentDto,
} from '../dto/update-department.dto';

import {
  DepartmentService,
} from '../services/department.service';

import {
  PermissionGuard,
} from '../../authorization/guards/permission.guard';

import {
  RequirePermission,
} from '../../authorization/decorators/require-permission.decorator';

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags('Department')
@ApiBearerAuth('access-token')
@UseGuards(
  AuthGuard('jwt'),
  PermissionGuard,
)
@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly departmentService:
      DepartmentService,
  ) {}

  @Post()
  @RequirePermission(
    'company.department.create',
  )
  @ApiOperation({
    summary:
      'Create Department',
  })
  @ApiResponse({
    status: 201,
    description:
      'Department created successfully.',
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    'company.department.view',
  )
  @ApiOperation({
    summary:
      'Get All Departments',
  })
  @ApiResponse({
    status: 200,
    description:
      'Departments fetched successfully.',
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.departmentService.findAll(
      req.user,
    );
  }

  @Get(':uuid')
  @RequirePermission(
    'company.department.view',
  )
  @ApiOperation({
    summary:
      'Get Department By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      'Department fetched successfully.',
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.departmentService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @RequirePermission(
    'company.department.update',
  )
  @ApiOperation({
    summary:
      'Update Department',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      'Department updated successfully.',
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,

    @Body()
    dto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateByUuid(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @RequirePermission(
    'company.department.delete',
  )
  @ApiOperation({
    summary:
      'Delete Department',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      'Department deleted successfully.',
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.departmentService.deleteByUuid(
      req.user,
      uuid,
    );
  }
}