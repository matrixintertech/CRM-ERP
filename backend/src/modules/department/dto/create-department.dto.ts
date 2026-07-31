import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateDepartmentDto {
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
    description: "Unique department code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional({
    example: "Handles software development and IT infrastructure.",
    description: "Department description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}