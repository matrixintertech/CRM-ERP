import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OrganizationUnitType } from '@prisma/client';

import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrganizationUnitDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  companyId: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({
    enum: OrganizationUnitType,
    example: OrganizationUnitType.HEAD_OFFICE,
  })
  @IsEnum(OrganizationUnitType)
  type: OrganizationUnitType;

  @ApiProperty({
    example: 'Head Office',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'HO001',
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pincode?: string;
}