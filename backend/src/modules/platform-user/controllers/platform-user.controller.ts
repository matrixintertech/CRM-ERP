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

import { AuthGuard } from '@nestjs/passport';

import type { Request } from 'express';

import type { User } from '@prisma/client';

import { CreatePlatformUserDto, UpdatePlatformUserDto } from '../dto';

import { PlatformUserService } from '../services/platform-user.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('Platform Users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('platform-users')
export class PlatformUserController {
  constructor(private readonly platformUserService: PlatformUserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Platform User',
  })
  @ApiResponse({
    status: 201,
    description: 'Platform user created successfully.',
  })
  create(
    @Req() req: AuthenticatedRequest,

    @Body()
    dto: CreatePlatformUserDto,
  ) {
    return this.platformUserService.create(req.user, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Platform Users',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform users fetched successfully.',
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.platformUserService.findAll(req.user);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get Platform User By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findOne(
    @Req() req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.platformUserService.findOne(req.user, uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update Platform User',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req() req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,

    @Body()
    dto: UpdatePlatformUserDto,
  ) {
    return this.platformUserService.update(req.user, uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Platform User',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  delete(
    @Req() req: AuthenticatedRequest,

    @Param('uuid')
    uuid: string,
  ) {
    return this.platformUserService.delete(req.user, uuid);
  }
}
