import {
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  Status,
} from "@prisma/client";

import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";


export class UpdatePlatformRoleDto {
  @ApiPropertyOptional({
    example: "Operations Admin",
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;


  @ApiPropertyOptional({
    example: "OPERATIONS_ADMIN",
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code?: string;


  @ApiPropertyOptional({
    example:
      "Platform operations role.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;


  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}