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
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthGuard,
} from '@nestjs/passport';

import type {
  Request,
} from 'express';

import type {
  User,
} from '@prisma/client';

import {
  CreateDesignationDto,
} from '../dto/create-designation.dto';

import {
  UpdateDesignationDto,
} from '../dto/update-designation.dto';

import {
  DesignationService,
} from '../services/designation.service';

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

@ApiTags('Designation')
@ApiBearerAuth('access-token')
@UseGuards(
  AuthGuard('jwt'),
  PermissionGuard,
)
@Controller('designations')
export class DesignationController {
  constructor(
    private readonly designationService:
      DesignationService,
  ) {}

  @Post()
  @RequirePermission(
    'company.designation.create',
  )
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateDesignationDto,
  ) {
    return this.designationService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    'company.designation.view',
  )
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.designationService.findAll(
      req.user,
    );
  }

  @Get(':uuid')
  @RequirePermission(
    'company.designation.view',
  )
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.designationService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @RequirePermission(
    'company.designation.update',
  )
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
    dto: UpdateDesignationDto,
  ) {
    return this.designationService.updateByUuid(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @RequirePermission(
    'company.designation.delete',
  )
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  delete(
    @Req()
    req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.designationService.deleteByUuid(
      req.user,
      uuid,
    );
  }
}