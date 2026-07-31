import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateDesignationDto {
  @ApiProperty({
    example: "Project Manager",
    description: "Designation name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "PM",
    description: "Unique designation code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @ApiPropertyOptional({
    example: "Responsible for managing projects and teams.",
    description: "Designation description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}