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
  ClientDropdownDto,
  ClientQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from '../dto';

import { ClientService } from '../services/client.service';

import type {
  User,
} from '@prisma/client';

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService:
      ClientService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Client',
  })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Clients',
  })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: ClientQueryDto,
  ) {
    return this.clientService.findAll(
      req.user,
      query,
    );
  }

  @Get('dropdown')
  @ApiOperation({
    summary: 'Client Dropdown',
  })
  findDropdown(
    @Req() req: AuthenticatedRequest,
    @Query() query: ClientDropdownDto,
  ) {
    return this.clientService.findDropdown(
      req.user,
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get Client By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findByUuid(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
  ) {
    return this.clientService.findByUuid(
      req.user,
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update Client',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.update(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Client',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
  ) {
    return this.clientService.remove(
      req.user,
      uuid,
    );
  }
}