import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCompanySubscriptionDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  companyId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  subscriptionPlanId: number;

  @ApiProperty({
    example: '2026-07-23',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2027-07-22',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}