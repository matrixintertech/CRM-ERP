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
  CreateProjectRoleDto,
} from "./create-project-role.dto";

export class UpdateProjectRoleDto extends PartialType(
  CreateProjectRoleDto,
) {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}