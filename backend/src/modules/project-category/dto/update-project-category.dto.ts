import {
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
} from 'class-validator';

import {
  Status,
} from '@prisma/client';

import {
  CreateProjectCategoryDto,
} from './create-project-category.dto';

export class UpdateProjectCategoryDto extends PartialType(
  CreateProjectCategoryDto,
) {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}