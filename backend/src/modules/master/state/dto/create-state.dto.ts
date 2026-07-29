import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateStateDto {
  @ApiProperty({
    example: "Uttar Pradesh",
    description: "State name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "UP",
    description: "State code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @ApiPropertyOptional({
    example: "09",
    description: "GST state code",
  })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  gstCode?: string;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    default: Status.ACTIVE,
    description: "State status",
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}