import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlatformUserDto {
  @ApiProperty({
    example: 'Platform Administrator',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

  @ApiProperty({
    example: 'platform.admin@example.com',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    example: '9876543210',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Mobile must contain 10 to 15 digits.',
  })
  mobile?: string;
}
