import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";


export class CreatePlatformRoleDto {
  @ApiProperty({
    example: "Operations Admin",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;


  @ApiProperty({
    example: "OPERATIONS_ADMIN",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code: string;


  @ApiPropertyOptional({
    example:
      "Platform operations role.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}