import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPlanModulesDto {
  @ApiProperty({
    description:
      'List of module IDs to assign to the subscription plan',
    example: [1, 2, 3, 5],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  moduleIds: number[];
}