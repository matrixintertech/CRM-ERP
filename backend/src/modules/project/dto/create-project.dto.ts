import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';


export class CreateProjectDto {

  @ApiPropertyOptional({
    example:
      '2f66f8cb-7c89-4b2d-9d73-56d9cb3f7d9d',
    description:
      'Required only for Platform Owner',
  })
  @IsOptional()
  @IsUUID()
  companyUuid?: string;



  @ApiProperty({
    example:
      '8f0e8f4d-efcb-4df8-bd7c-4f7e8a5a7f14',
    description:
      'Client UUID',
  })
  @IsUUID()
  clientUuid: string;



  @ApiProperty({
    example:
      'commercial-category-uuid',
    description:
      'Project category UUID',
  })
  @IsUUID()
  categoryUuid: string;



 @ApiProperty({
  example:
    'branch-delhi-uuid',
  description:
    'Organization unit / Branch UUID handling this project',
})
@IsUUID()
organizationUnitUuid: string;



  @ApiProperty({
    example:
      'Corporate Office Interior',
    description:
      'Project name',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name: string;



  @ApiPropertyOptional({
    example:
      'c7a31b3b-61fb-4d1b-a7a8-d5d70d3c7d88',
    description:
      'Project location state UUID',
  })
  @IsOptional()
  @IsUUID()
  stateUuid?: string;



  @ApiPropertyOptional({
    example:
      'c24d95fd-2d90-4f5e-bd4e-d1b98763f30a',
    description:
      'Project location city UUID',
  })
  @IsOptional()
  @IsUUID()
  cityUuid?: string;



  @ApiPropertyOptional({
    example:
      'Sector 63, Noida',
    description:
      'Project site address',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;



  @ApiPropertyOptional({
    example:
      '201301',
    description:
      'Project site pincode',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;



  @ApiPropertyOptional({
    example:
      '2026-08-01',
    description:
      'Project start date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;



  @ApiPropertyOptional({
    example:
      '2026-10-31',
    description:
      'Expected project completion date',
  })
  @IsOptional()
  @IsDateString()
  expectedEndDate?: string;



  @ApiPropertyOptional({
    example:
      'Interior work for Head Office',
    description:
      'Project remarks',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

}