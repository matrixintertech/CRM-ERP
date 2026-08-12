import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  PermissionScope,
  PermissionType,
  Status,
} from '@prisma/client';

import {
  PermissionModule,
} from '../enums/permission-module.enum';

export class CreatePermissionDto {
  @ApiProperty({
    enum: PermissionModule,
    example: PermissionModule.COMPANY,
  })
  @IsEnum(PermissionModule)
  module: PermissionModule;

  @ApiProperty({
    enum: PermissionType,
    example: PermissionType.COMPANY,
  })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({
    example: 'View Project Categories',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example:
      'company.project_category.view',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    enum: PermissionScope,
    isArray: true,
    example: [
      PermissionScope.COMPANY,
    ],
    description:
      'Scopes supported by this permission. PLATFORM permissions must use an empty array.',
  })
  @IsArray()
  @IsEnum(
    PermissionScope,
    {
      each: true,
    },
  )
  allowedScopes: PermissionScope[];

  @ApiPropertyOptional({
    example:
      'Allow user to view project categories',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}