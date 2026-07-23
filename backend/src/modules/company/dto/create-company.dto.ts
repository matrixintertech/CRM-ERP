import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'ABC Interior Pvt Ltd',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'ABC001',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @ApiProperty({
    example: 'info@abc.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '9876543210',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  mobile?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;
}