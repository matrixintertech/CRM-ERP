import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  Status,
} from '@prisma/client';


export class ProjectQueryDto {

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;



  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;



  @ApiPropertyOptional({
    example: 'Office',
    description:
      'Search by project name or SRN',
  })
  @IsOptional()
  @IsString()
  search?: string;



  @ApiPropertyOptional({
    example:
      'c7a31b3b-61fb-4d1b-a7a8-d5d70d3c7d88',
    description:
      'Filter by project category UUID',
  })
  @IsOptional()
  @IsUUID()
  categoryUuid?: string;



  @ApiPropertyOptional({
    example:
      '7d4c40bb-8df6-4b93-9d34-3b66d5f8c541',
    description:
      'Filter by organization unit / branch UUID',
  })
  @IsOptional()
  @IsUUID()
  organizationUnitUuid?: string;



  @ApiPropertyOptional({
    example:
      'a9d4d6f8-1234-4567',
    description:
      'Filter by state UUID',
  })
  @IsOptional()
  @IsUUID()
  stateUuid?: string;



  @ApiPropertyOptional({
    example:
      'b8d4d6f8-1234-4567',
    description:
      'Filter by city UUID',
  })
  @IsOptional()
  @IsUUID()
  cityUuid?: string;



  @ApiPropertyOptional({
    enum: Status,
    example:
      Status.ACTIVE,
    description:
      'Filter by project status',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

}