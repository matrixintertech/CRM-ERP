import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCompanyProfileDto {
  @ApiPropertyOptional({
    example: "ABC Interiors Pvt Ltd",
    description: "Company name",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: "info@abcinteriors.com",
    description: "Company email address",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: "9876543210",
    description: "Company mobile number",
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  mobile?: string;
}