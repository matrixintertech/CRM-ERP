import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  EmploymentType,
  Gender,
  Status,
} from "@prisma/client";

export class CreateEmployeeDto {
  @ApiProperty({
    example: "Anil",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    example: "Sahu",
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: "Anil Sahu",
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    example: "anil@example.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: "9876543210",
  })
  @IsMobilePhone("en-IN")
  mobile: string;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description:
      "Organization Unit UUID",
    example:
      "b68b1d3f-8c27-4b8f-91d2-2f1d7b6d8c10",
  })
  @IsOptional()
  @IsUUID()
  organizationUnitUuid?: string;

  @ApiPropertyOptional({
    description:
      "Department UUID",
    example:
      "e1b6f7fd-c3ef-4f18-93fa-cc5d09cb4d9a",
  })
  @IsOptional()
  @IsUUID()
  departmentUuid?: string;

  @ApiPropertyOptional({
    description:
      "Designation UUID",
    example:
      "f0a42b54-0bc5-4b5d-9bb9-66fd1a2b0d20",
  })
  @IsOptional()
  @IsUUID()
  designationUuid?: string;

  @ApiPropertyOptional({
    description:
      "Reporting Manager UUID",
    example:
      "7d4c40bb-8df6-4b93-9d34-3b66d5f8c541",
  })
  @IsOptional()
  @IsUUID()
  managerUuid?: string;

  @ApiPropertyOptional({
    example: "2026-08-01",
  })
  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @ApiPropertyOptional({
    enum: EmploymentType,
    example:
      EmploymentType.FULL_TIME,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({
    example:
      "https://example.com/avatar.jpg",
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}