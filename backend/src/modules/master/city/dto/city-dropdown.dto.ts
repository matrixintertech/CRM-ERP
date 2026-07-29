import { ApiPropertyOptional } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CityDropdownDto {
  @ApiPropertyOptional({
    example: "b8d5f1d4-6b1e-4e5c-9d8d-2c4d8d5b7f1a",
    description: "Filter cities by state UUID",
  })
  @IsOptional()
  @IsUUID()
  stateUuid?: string;

  @ApiPropertyOptional({
    example: "noi",
    description: "Search city by name",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    description: "Filter cities by status",
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}