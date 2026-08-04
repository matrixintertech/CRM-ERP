import {
  Body,
  Controller,
  Post,Get, Query, Param,Patch, Delete,UseGuards,Req 
} from '@nestjs/common';

import {
  ApiOperation,ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { UserType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../auth/guards/user-type.guard';

import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { GetCompaniesDto } from '../dto/get-companies.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyProfileDto } from '../dto/update-company-profile.dto';

import { UserTypes } from '../../auth/decorators/user-types.decorator';

import { CompanyAdminService } from '../services/company-admin.service';

@ApiTags('Company')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard,  UserTypeGuard)
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
     private readonly companyAdminService: CompanyAdminService,
  ) {}


@UserTypes(UserType.PLATFORM_OWNER)


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

@Get('profile')
async getProfile(
  @Req() req: Request,
) {
  const user = (req as any).user;

  return this.companyService.getProfile(
    BigInt(user.companyId),
  );
}

@Patch('profile')
async updateProfile(
  @Req() req: Request,

  @Body()
  dto: UpdateCompanyProfileDto,
) {
  const user = (req as any).user;

  return this.companyService.updateProfile(
    BigInt(user.companyId),
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


@Post(':companyId/admin')
@ApiOperation({
  summary: 'Create Company Admin',
})
createCompanyAdmin(
  @Param('companyId')
  companyId: string,

  @Body()
  dto: CreateCompanyAdminDto,
) {
  return this.companyAdminService.create(
    BigInt(companyId),
    dto,
  );
}



}