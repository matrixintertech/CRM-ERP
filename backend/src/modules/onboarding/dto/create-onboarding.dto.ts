import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateCompanyDto } from '../../company/dto/create-company.dto';
import { AssignPlanDto } from '../../company-subscription/dto/assign-plan.dto';
import { CreateCompanyAdminDto } from '../../user/dto/create-company-admin.dto';

export class CreateOnboardingDto {
  @ApiProperty({
    type: CreateCompanyDto,
  })
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @ApiProperty({
    type: AssignPlanDto,
  })
  @ValidateNested()
  @Type(() => AssignPlanDto)
  subscription: AssignPlanDto;

  @ApiProperty({
    type: CreateCompanyAdminDto,
  })
  @ValidateNested()
  @Type(() => CreateCompanyAdminDto)
  admin: CreateCompanyAdminDto;
}