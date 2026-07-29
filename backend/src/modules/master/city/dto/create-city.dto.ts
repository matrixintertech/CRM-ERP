import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateCityDto {
  @ApiProperty({
    example: "b8d5f1d4-6b1e-4e5c-9d8d-2c4d8d5b7f1a",
    description: "State UUID",
  })
  @IsUUID()
  @IsNotEmpty()
  stateUuid: string;

  @ApiProperty({
    example: "Noida",
    description: "City name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    default: Status.ACTIVE,
    description: "City status",
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}