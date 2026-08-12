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

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import type {
  Request,
} from 'express';

import type {
  User,
} from '@prisma/client';

import {
  RequirePermission,
} from 'src/modules/authorization/decorators/require-permission.decorator';

import {
  PermissionGuard,
} from 'src/modules/authorization/guards/permission.guard';

import {
  CreateProjectCategoryDto,
  UpdateProjectCategoryDto,
} from '../dto';

import {
  ProjectCategoryService,
} from '../services/project-category.service';

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags('Project Categories')
@ApiBearerAuth('access-token')
@UseGuards(
  AuthGuard('jwt'),
  PermissionGuard,
)
@Controller('project-categories')
export class ProjectCategoryController {
  constructor(
    private readonly projectCategoryService:
      ProjectCategoryService,
  ) {}

  @Post()
  @RequirePermission(
    'company.project_category.create',
  )
  @ApiOperation({
    summary:
      'Create Project Category',
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateProjectCategoryDto,
  ) {
    return this.projectCategoryService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    'company.project_category.view',
  )
  @ApiOperation({
    summary:
      'Get All Project Categories',
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.projectCategoryService.findAll(
      req.user,
    );
  }

  @Get(':uuid')
  @RequirePermission(
    'company.project_category.view',
  )
  @ApiOperation({
    summary:
      'Get Project Category By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findByUuid(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.projectCategoryService.findOne(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @RequirePermission(
    'company.project_category.update',
  )
  @ApiOperation({
    summary:
      'Update Project Category',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,

    @Body()
    dto: UpdateProjectCategoryDto,
  ) {
    return this.projectCategoryService.update(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @RequirePermission(
    'company.project_category.delete',
  )
  @ApiOperation({
    summary:
      'Delete Project Category',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.projectCategoryService.delete(
      req.user,
      uuid,
    );
  }
}