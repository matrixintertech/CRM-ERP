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

import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from '../dto';

import { ProjectService } from '../services/project.service';

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Project' })
  create(
    @Req() req: Request,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.create(
      (req.user as any).companyId,
      dto,
    );
  }

@Get()
@ApiOperation({ summary: 'Get All Projects' })
findAll(
  @Req() req: Request,
  @Query() query: ProjectQueryDto,
) {
  return this.projectService.findAll(
    (req.user as any).companyId,
    query,
  );
}

  @Get(':uuid')
  @ApiOperation({ summary: 'Get Project By UUID' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findByUuid(
    @Req() req: Request,
    @Param('uuid') uuid: string,
  ) {
    return this.projectService.findByUuid(
      (req.user as any).companyId,
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update Project' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(
      (req.user as any).companyId,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete Project' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  remove(
    @Req() req: Request,
    @Param('uuid') uuid: string,
  ) {
    return this.projectService.remove(
      (req.user as any).companyId,
      uuid,
    );
  }
}