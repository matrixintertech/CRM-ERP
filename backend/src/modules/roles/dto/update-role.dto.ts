import {
  ApiPropertyOptional,
  PartialType,
} from "@nestjs/swagger";

import {
  IsEnum,
  IsOptional,
} from "class-validator";

import {
  Status,
} from "@prisma/client";

import {
  CreateRoleDto,
} from "./create-role.dto";

export class UpdateRoleDto extends PartialType(
  CreateRoleDto,
) {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}