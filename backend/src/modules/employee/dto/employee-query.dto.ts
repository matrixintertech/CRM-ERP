import {
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";

import {
  EmploymentType,
  Gender,
  Status,
} from "@prisma/client";

export class EmployeeQueryDto {
  @ApiPropertyOptional({
    description: "Organization Unit UUID",
  })
  @IsOptional()
  @IsUUID()
  organizationUnitUuid?: string;

  @ApiPropertyOptional({
    description: "Department UUID",
  })
  @IsOptional()
  @IsUUID()
  departmentUuid?: string;

  @ApiPropertyOptional({
    description: "Designation UUID",
  })
  @IsOptional()
  @IsUUID()
  designationUuid?: string;

  @ApiPropertyOptional({
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    enum: EmploymentType,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}