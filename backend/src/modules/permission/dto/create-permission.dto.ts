import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import {
  PermissionType,
  Status,
} from "@prisma/client";

import {
  PermissionModule,
} from "../enums/permission-module.enum";

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
    example: "Create Company",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "company.create",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({
    example:
      "Allow user to create company",
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