import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';


import { CreateOrganizationUnitDto } from '../dto/create-organization-unit.dto';
import { OrganizationUnitService } from '../services/organization-unit.service';
import { UpdateOrganizationUnitDto } from '../dto/update-organization-unit.dto';

@ApiTags('Organization Unit')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('organization-units')
export class OrganizationUnitController {
  constructor(
    private readonly organizationUnitService: OrganizationUnitService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Organization Unit',
  })
  @ApiResponse({
    status: 201,
    description:
      'Organization unit created successfully.',
  })
 create(
  @Req() req: Request,
  @Body() dto: CreateOrganizationUnitDto,
) {
  return this.organizationUnitService.create(
    Number((req.user as any).companyId),
    dto,
  );
}



@Get()
@ApiOperation({
  summary: 'Get Organization Units',
})
@ApiResponse({
  status: 200,
  description: 'Organization units fetched successfully.',
})
findAll(
  @Req() req: Request,
) {
  return this.organizationUnitService.findAll(
    Number((req.user as any).companyId),
  );
}


@Get(':id')
@ApiOperation({
  summary: 'Get Organization Unit',
})
@ApiResponse({
  status: 200,
  description:
    'Organization unit fetched successfully.',
})
findOne(
  @Req() req: Request,

  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.organizationUnitService.findOne(
    Number((req.user as any).companyId),
    id,
  );
}


@Patch(':id')
@ApiOperation({
  summary:
    'Update Organization Unit',
})
@ApiResponse({
  status: 200,
  description:
    'Organization unit updated successfully.',
})
update(
  @Req() req: Request,

  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,

  @Body()
  dto: UpdateOrganizationUnitDto,
) {
  return this.organizationUnitService.update(
    Number((req.user as any).companyId),
    id,
    dto,
  );
}


@Delete(':id')
@ApiOperation({
  summary:
    'Delete Organization Unit',
})
@ApiResponse({
  status: 200,
  description:
    'Organization unit deleted successfully.',
})
delete(
  @Req() req: Request,

  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.organizationUnitService.delete(
    Number((req.user as any).companyId),
    id,
  );
}





}