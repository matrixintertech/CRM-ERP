import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  UserStatus,
  UserType,
} from '@prisma/client';

import {
  Type,
} from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UserQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description:
      'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description:
      'Number of users per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'rahul',
    description:
      'Search by display name, email, mobile, employee code or role name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    enum: UserType,
    example: UserType.EMPLOYEE,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiPropertyOptional({
    example:
      '2f4e1216-a8e9-48c7-a5ac-4cf352b44e0e',
    description:
      'Filter users by role UUID',
  })
  @IsOptional()
  @IsUUID()
  roleUuid?: string;
}