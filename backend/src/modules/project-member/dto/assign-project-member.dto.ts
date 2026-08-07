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

export class AssignProjectMemberDto {
  @ApiProperty({
    description:
      "UUID of the employee to assign.",
    example:
      "f8f32a70-53b7-4d0e-a61a-8598720a45cc",
  })
  @IsUUID()
  @IsNotEmpty()
  employeeUuid: string;

  @ApiProperty({
    description:
      "UUID of the project role.",
    example:
      "a9f76cf3-0ef1-4fd1-be29-307893249e3e",
  })
  @IsUUID()
  @IsNotEmpty()
  projectRoleUuid: string;

  @ApiPropertyOptional({
    description:
      "Optional remarks for this project assignment.",
    example:
      "Assigned for primary service responsibility.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}