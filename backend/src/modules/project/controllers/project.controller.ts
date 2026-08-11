import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import type { Request } from 'express';

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
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from '../dto';

import {
  ProjectService,
} from '../services/project.service';

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@UseGuards(
  AuthGuard('jwt'),
  PermissionGuard,
)
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService:
      ProjectService,
  ) {}

  @Post()
  @RequirePermission(
    'company.project.create',
  )
  @ApiOperation({
    summary: 'Create Project',
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateProjectDto,
  ) {
    return this.projectService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    'company.project.view',
  )
  @ApiOperation({
    summary: 'Get All Projects',
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,

    @Query()
    query: ProjectQueryDto,
  ) {
    return this.projectService.findAll(
      req.user,
      query,
    );
  }

  @Get(':uuid')
  @RequirePermission(
    'company.project.view',
  )
  @ApiOperation({
    summary: 'Get Project By UUID',
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
    return this.projectService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @RequirePermission(
    'company.project.update',
  )
  @ApiOperation({
    summary: 'Update Project',
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
    dto: UpdateProjectDto,
  ) {
    return this.projectService.update(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @RequirePermission(
    'company.project.delete',
  )
  @ApiOperation({
    summary: 'Delete Project',
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
    return this.projectService.remove(
      req.user,
      uuid,
    );
  }
}