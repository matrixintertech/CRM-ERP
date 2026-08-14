import {
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
} from 'class-validator';

import {
  UserStatus,
} from '@prisma/client';

import {
  CreatePlatformUserDto,
} from './create-platform-user.dto';


export class UpdatePlatformUserDto extends PartialType(
  CreatePlatformUserDto,
) {
  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}