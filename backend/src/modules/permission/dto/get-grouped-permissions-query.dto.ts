import {
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsEnum,
  IsOptional,
} from "class-validator";

import {
  PermissionType,
} from "@prisma/client";

export class GetGroupedPermissionsQueryDto {
  @ApiPropertyOptional({
    enum: PermissionType,
    example: PermissionType.COMPANY,
  })
  @IsOptional()
  @IsEnum(PermissionType)
  type?: PermissionType;
}