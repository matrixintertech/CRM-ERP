import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  UserStatus,
} from "@prisma/client";

import {
  IsEnum,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateEmployeeUserAccountDto {
  @ApiProperty({
    description: "Role UUID",
    example:
      "8c3248d2-449f-4f36-a5d1-4f5d92a3a4e6",
  })
  @IsUUID()
  roleUuid: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}