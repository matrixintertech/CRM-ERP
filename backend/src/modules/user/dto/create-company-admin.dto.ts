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
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCompanyAdminDto {
  @ApiProperty({
    example: 'Anil Kumar',
  })
  @IsString()
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
  @Matches(/^[6-9]\d{9}$/)
  mobile?: string;

  @IsEnum(UserType)
  userType: UserType = UserType.COMPANY_ADMIN;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ACTIVE;
}