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
  ClientDropdownDto,
  ClientQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from '../dto';

import {
  ClientService,
} from '../services/client.service';

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@UseGuards(
  AuthGuard('jwt'),
  PermissionGuard,
)
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService:
      ClientService,
  ) {}

  @Post()
  @RequirePermission(
    'company.client.create',
  )
  @ApiOperation({
    summary: 'Create Client',
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateClientDto,
  ) {
    return this.clientService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    'company.client.view',
  )
  @ApiOperation({
    summary: 'Get All Clients',
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,

    @Query()
    query: ClientQueryDto,
  ) {
    return this.clientService.findAll(
      req.user,
      query,
    );
  }

  @Get('dropdown')
  @RequirePermission(
    'company.client.view',
  )
  @ApiOperation({
    summary: 'Client Dropdown',
  })
  findDropdown(
    @Req()
    req: AuthenticatedRequest,

    @Query()
    query: ClientDropdownDto,
  ) {
    return this.clientService.findDropdown(
      req.user,
      query,
    );
  }

  @Get(':uuid')
  @RequirePermission(
    'company.client.view',
  )
  @ApiOperation({
    summary: 'Get Client By UUID',
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
    return this.clientService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @RequirePermission(
    'company.client.update',
  )
  @ApiOperation({
    summary: 'Update Client',
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
    dto: UpdateClientDto,
  ) {
    return this.clientService.update(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @RequirePermission(
    'company.client.delete',
  )
  @ApiOperation({
    summary: 'Delete Client',
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
    return this.clientService.remove(
      req.user,
      uuid,
    );
  }
}