import {
  Body,
  Controller,
  Post,Get, Query, Param,Patch, Delete,UseGuards
} from '@nestjs/common';

import {
  ApiOperation,ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { GetCompaniesDto } from '../dto/get-companies.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@ApiTags('Company')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}



  @Post()
 
  @ApiOperation({
    summary: 'Create Company',
  })
  create(
    @Body()
    dto: CreateCompanyDto,
  ) {
    return this.companyService.create(
      dto,
    );
  }


  @Get()
@ApiOperation({
  summary: 'Company List',
})
findAll(
  @Query()
  dto: GetCompaniesDto,
) {
  return this.companyService.findAll(
    dto,
  );
}


@Get(':id')
@ApiOperation({
  summary: 'Get Company Details',
})
findById(
  @Param('id')
  id: string,
) {
  return this.companyService.findById(
    BigInt(id),
  );
}


@Patch(':id')
@ApiOperation({
  summary: 'Update Company',
})
update(
  @Param('id')
  id: string,

  @Body()
  dto: UpdateCompanyDto,
) {
  return this.companyService.update(
    BigInt(id),
    dto,
  );
}

@Delete(':id')
@ApiOperation({
  summary: 'Delete Company',
})
delete(
  @Param('id')
  id: string,
) {
  return this.companyService.delete(
    BigInt(id),
  );
}



}