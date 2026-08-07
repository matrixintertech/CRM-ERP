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
  MaxLength,
  Min,
} from "class-validator";

export class CreateProjectRoleDto {
  @ApiProperty({
    example: "Project Manager",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "PROJECT_MANAGER",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({
    example:
      "Responsible for overall project delivery.",
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
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}