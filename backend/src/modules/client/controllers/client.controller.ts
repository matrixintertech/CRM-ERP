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

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Client' })
  create(
    @Req() req: Request,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientService.create(
      (req.user as any).companyId,
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get All Clients' })
  findAll(
    @Req() req: Request,
    @Query() query: ClientQueryDto,
  ) {
    return this.clientService.findAll(
      (req.user as any).companyId,
      query,
    );
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Client Dropdown' })
  findDropdown(
    @Req() req: Request,
    @Query() query: ClientDropdownDto,
  ) {
    return this.clientService.findDropdown(
      (req.user as any).companyId,
      query,
    );
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get Client By UUID' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findByUuid(
    @Req() req: Request,
    @Param('uuid') uuid: string,
  ) {
    return this.clientService.findByUuid(
      (req.user as any).companyId,
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update Client' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.update(
      (req.user as any).companyId,
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete Client' })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  remove(
    @Req() req: Request,
    @Param('uuid') uuid: string,
  ) {
    return this.clientService.remove(
      (req.user as any).companyId,
      uuid,
    );
  }
}