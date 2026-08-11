import {
  PartialType,
} from '@nestjs/mapped-types';

import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Status,
} from '@prisma/client';

import {
  IsEnum,
  IsOptional,
} from 'class-validator';

import {
  CreateProjectDto,
} from './create-project.dto';

export class UpdateProjectDto
  extends PartialType(
    CreateProjectDto,
  ) {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    description:
      'Project status',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}