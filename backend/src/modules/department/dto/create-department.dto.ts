import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateDepartmentDto {
  @ApiProperty({
    description: "Organization Unit UUID",
    example:
      "b68b1d3f-8c27-4b8f-91d2-2f1d7b6d8c10",
  })
  @IsUUID()
  @IsNotEmpty()
  organizationUnitUuid: string;

  @ApiProperty({
    example: "Information Technology",
    description: "Department name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "IT",
    description: "Department code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional({
    example:
      "Handles software development and IT infrastructure.",
    description:
      "Department description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}