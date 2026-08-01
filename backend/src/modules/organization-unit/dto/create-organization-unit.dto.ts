import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  OrganizationUnitType,
  Status,
} from '@prisma/client';

import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';


export class CreateOrganizationUnitDto {

  @ApiPropertyOptional({
    description:
      'Required only for Platform Owner',
    example:
      '7c2b9d90-59f3-4e7a-a53e-61b2b6b5d9a7',
  })
  @IsOptional()
  @IsUUID()
  companyUuid?: string;


  @ApiPropertyOptional({
    description:
      'Parent Organization Unit UUID',
    example:
      '51c0c87d-3f63-4df8-b2d2-00c9e79b96c2',
  })
  @IsOptional()
  @IsUUID()
  parentUuid?: string;


  @ApiProperty({
    enum: OrganizationUnitType,
    example:
      OrganizationUnitType.HEAD_OFFICE,
  })
  @IsEnum(OrganizationUnitType)
  type: OrganizationUnitType;


  @ApiProperty({
    example:
      'Head Office',
  })
  @IsString()
  name: string;


  @ApiProperty({
    example:
      'HO001',
  })
  @IsString()
  code: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine1?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;


  @ApiPropertyOptional({
    description:
      'State UUID',
  })
  @IsOptional()
  @IsUUID()
  stateUuid?: string;


  @ApiPropertyOptional({
    description:
      'City UUID',
  })
  @IsOptional()
  @IsUUID()
  cityUuid?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pincode?: string;


  @ApiPropertyOptional({
    enum: Status,
    default: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}