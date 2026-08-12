import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProjectRoleDto {
  @ApiProperty({
    example: "Service Manager",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "SERVICE_MANAGER",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({
    example:
      "Responsible for service management.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSingleAssignee?: boolean;

  @ApiPropertyOptional({
    description:
      "UUID of the project role that must be assigned before this role.",
    example:
      "a9f76cf3-0ef1-4fd1-be29-307893249e3e",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  requiredRoleUuid?: string | null;

  @ApiPropertyOptional({
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}