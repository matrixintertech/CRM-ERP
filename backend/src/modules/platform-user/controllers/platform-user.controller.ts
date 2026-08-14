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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { Request } from 'express';
import type { User } from '@prisma/client';

import {
  JwtAuthGuard,
} from '../../auth/guards/jwt-auth.guard';

import {
  PermissionGuard,
} from '../../authorization/guards/permission.guard';

import {
  RequirePermission,
} from '../../authorization/decorators/require-permission.decorator';

import {
  CreatePlatformUserDto,
  UpdatePlatformUserDto,
} from '../dto';

import {
  PlatformUserService,
} from '../services/platform-user.service';


interface AuthenticatedRequest extends Request {
  user: User;
}


@ApiTags('Platform Users')
@ApiBearerAuth('access-token')
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller('platform/users')
export class PlatformUserController {
  constructor(
    private readonly platformUserService:
      PlatformUserService,
  ) {}


  @Post()
  // @RequirePermission(
  //   'platform.user.create',
  // )
  @ApiOperation({
    summary: 'Create Platform User',
  })
  @ApiResponse({
    status: 201,
    description:
      'Platform user created successfully.',
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreatePlatformUserDto,
  ) {
    return this.platformUserService.create(
      req.user,
      dto,
    );
  }


  @Get()
  // @RequirePermission(
  //   'platform.user.view',
  // )
  @ApiOperation({
    summary:
      'Get All Platform Users',
  })
  @ApiResponse({
    status: 200,
    description:
      'Platform users fetched successfully.',
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.platformUserService.findAll(
      req.user,
    );
  }


  @Get(':uuid')
  // @RequirePermission(
  //   'platform.user.view',
  // )
  @ApiOperation({
    summary:
      'Get Platform User By UUID',
  })
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
    return this.platformUserService.findOne(
      req.user,
      uuid,
    );
  }


  @Patch(':uuid')
  // @RequirePermission(
  //   'platform.user.update',
  // )
  @ApiOperation({
    summary:
      'Update Platform User',
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
    dto: UpdatePlatformUserDto,
  ) {
    return this.platformUserService.update(
      req.user,
      uuid,
      dto,
    );
  }


  @Delete(':uuid')
  @RequirePermission(
    'platform.user.delete',
  )
  @ApiOperation({
    summary:
      'Delete Platform User',
  })
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
    return this.platformUserService.delete(
      req.user,
      uuid,
    );
  }
}