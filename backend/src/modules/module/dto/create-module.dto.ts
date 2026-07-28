import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Status,
} from "@prisma/client";

export class CreateModuleDto {
  @ApiProperty({
    example: 'Inventory',
    description: 'Module name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'INVENTORY',
    description: 'Unique module code',
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    example: 'Inventory management module',
    description: 'Module description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Package',
    description: 'Icon name for frontend',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: '/inventory',
    description: 'Frontend route',
  })
  @IsOptional()
  @IsString()
  route?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Display order',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'System module',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

@ApiPropertyOptional({
  enum: Status,
  default: Status.ACTIVE,
})
@IsOptional()
@IsEnum(Status)
status?: Status;


}