import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateOrganizationUnitDto } from '../dto/create-organization-unit.dto';
import { OrganizationUnitService } from '../services/organization-unit.service';
import { UpdateOrganizationUnitDto } from '../dto/update-organization-unit.dto';

@ApiTags('Organization Unit')
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
    @Body()
    dto: CreateOrganizationUnitDto,
  ) {
    return this.organizationUnitService.create(
      dto,
    );
  }


  @Get('company/:companyId')
@ApiOperation({
  summary:
    'Get organization units by company',
})
findAll(
  @Param(
    'companyId',
    ParseIntPipe,
  )
  companyId: number,
) {
  return this.organizationUnitService.findAll(
    companyId,
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
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.organizationUnitService.findOne(
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
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,

  @Body()
  dto: UpdateOrganizationUnitDto,
) {
  return this.organizationUnitService.update(
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
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.organizationUnitService.delete(
    id,
  );
}


}