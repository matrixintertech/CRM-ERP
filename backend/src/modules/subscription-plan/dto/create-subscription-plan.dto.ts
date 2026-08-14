import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";

import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  BillingCycle,
  PlanType,
  SubscriptionStatus,
} from "@prisma/client";


export class CreateSubscriptionPlanDto {
  @ApiProperty({
    example: "Professional",
    description:
      "Subscription plan name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;


  @ApiProperty({
    example: "PRO",
    description:
      "Unique subscription plan code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;


  @ApiPropertyOptional({
    example:
      "Professional subscription plan",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;


  @ApiProperty({
    enum: PlanType,
    example:
      PlanType.PAID,
  })
  @IsEnum(
    PlanType,
  )
  planType:
    PlanType;


  @ApiProperty({
    enum:
      BillingCycle,

    example:
      BillingCycle.MONTHLY,
  })
  @IsEnum(
    BillingCycle,
  )
  billingCycle:
    BillingCycle;


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
  @IsInt()
  @Min(0)
  trialDays?: number;


  @ApiPropertyOptional({
    example: 365,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationInDays?: number;


  @ApiPropertyOptional({
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxUsers?: number;


  @ApiPropertyOptional({
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxBranches?: number;


  @ApiPropertyOptional({
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxProjects?: number;


  @ApiPropertyOptional({
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;


  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;


  @ApiPropertyOptional({
    enum:
      SubscriptionStatus,

    example:
      SubscriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(
    SubscriptionStatus,
  )
  status?:
    SubscriptionStatus;


  @ApiPropertyOptional({
    type: [
      String,
    ],

    example: [
      "1",
      "2",
      "3",
    ],

    description:
      "Selected module database IDs",
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({
    each: true,
  })
  @Matches(
    /^\d+$/,
    {
      each: true,
      message:
        "Each moduleId must be a valid numeric ID.",
    },
  )
  moduleIds?: string[];
}