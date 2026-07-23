import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  BillingCycle,
  PlanType,
} from '@prisma/client';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    example: 'Professional',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'PRO',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    example: 'Professional subscription plan',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: PlanType,
    example: PlanType.PAID,
  })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiProperty({
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({
    example: 999,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 15,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}