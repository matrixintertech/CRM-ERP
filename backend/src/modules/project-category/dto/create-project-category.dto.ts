import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";


export class CreateProjectCategoryDto {

  @ApiProperty({
    example: "Commercial",
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    example: "COMMERCIAL",
  })
  @IsString()
  @IsNotEmpty()
  code: string;


  @ApiPropertyOptional({
    example:
      "Commercial building projects",
  })
  @IsOptional()
  @IsString()
  description?: string;


  @ApiPropertyOptional({
    example:"#3B82F6",
  })
  @IsOptional()
  @IsString()
  color?: string;


  @ApiPropertyOptional({
    example:1,
  })
  @IsOptional()
  sortOrder?: number;

}