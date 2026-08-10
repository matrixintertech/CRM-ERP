import {
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  Type,
} from "class-transformer";

import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import {
  Status,
} from "@prisma/client";

import {
  PermissionModule,
} from "../enums/permission-module.enum";

export class GetPermissionsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: "company",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: PermissionModule,
    example: PermissionModule.COMPANY,
  })
  @IsOptional()
  @IsEnum(PermissionModule)
  module?: PermissionModule;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    enum: [
      "name",
      "module",
      "code",
      "status",
    ],
    default: "name",
  })
  @IsOptional()
  @IsIn([
    "name",
    "module",
    "code",
    "status",
  ])
  sortBy?:
    | "name"
    | "module"
    | "code"
    | "status";

  @ApiPropertyOptional({
    enum: [
      "asc",
      "desc",
    ],
    default: "asc",
  })
  @IsOptional()
  @IsIn([
    "asc",
    "desc",
  ])
  sortOrder?:
    | "asc"
    | "desc";
}