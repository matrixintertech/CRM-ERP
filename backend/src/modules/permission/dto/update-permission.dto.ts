import {
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import { PermissionModule } from "../enums/permission-module.enum";

export class UpdatePermissionDto {
  @ApiPropertyOptional({
    enum: PermissionModule,
  })
  @IsOptional()
  @IsEnum(PermissionModule)
  module?: PermissionModule;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}