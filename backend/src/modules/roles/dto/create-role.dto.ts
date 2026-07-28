import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  companyId: number;

  @ApiProperty({
    example: 'HR Manager',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'HR_MANAGER',
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    example: 'Manage HR activities',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}