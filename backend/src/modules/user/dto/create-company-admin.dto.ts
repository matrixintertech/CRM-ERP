import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCompanyAdminDto {
  @ApiProperty({
    example: 'Anil Kumar',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
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
  @Matches(
    /^[6-9]\d{9}$/,
    {
      message:
        'Invalid mobile number.',
    },
  )
  mobile?: string;
}