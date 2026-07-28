import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class AssignPlanDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  subscriptionPlanId: number;
}