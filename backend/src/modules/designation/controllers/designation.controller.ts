import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import type { Request } from 'express';

import { UserType, type User } from '@prisma/client';

import { CreateDesignationDto } from '../dto/create-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation.dto';

import { DesignationService } from '../services/designation.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('Designation')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  private getCompanyId(user: User): bigint {
    if (!user.companyId) {
      throw new ForbiddenException('Company context is missing.');
    }

    return user.companyId;
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateDesignationDto) {
    return this.designationService.create(this.getCompanyId(req.user), dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const companyId =
      req.user.userType === UserType.PLATFORM_OWNER
        ? undefined
        : this.getCompanyId(req.user);

    return this.designationService.findAll(companyId);
  }

  @Get(':uuid')
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  findOne(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.designationService.findByUuid(
      this.getCompanyId(req.user),
      uuid,
    );
  }

  @Patch(':uuid')
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDesignationDto,
  ) {
    return this.designationService.updateByUuid(
      this.getCompanyId(req.user),
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  delete(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.designationService.deleteByUuid(
      this.getCompanyId(req.user),
      uuid,
    );
  }
}
