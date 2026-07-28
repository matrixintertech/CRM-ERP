import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  UserStatus,
  UserType,
} from '@prisma/client';

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Anil Kumar',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({
    example: 'admin@company.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '9876543210',
  })
  @IsOptional()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Invalid mobile number.',
  })
  mobile?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  companyId?: number;

  @ApiProperty({
    enum: UserType,
    example: UserType.COMPANY_ADMIN,
  })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}