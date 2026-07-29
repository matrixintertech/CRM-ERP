import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Status } from "@prisma/client";

export class StateDropdownDto {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    default: Status.ACTIVE,
    description: "Filter states by status",
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.ACTIVE;
}