import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import {
  Type,
} from "class-transformer";

import {
  VendorMarketplaceStatus,
  VendorStatus,
} from "@prisma/client";

export class VendorQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(
    VendorStatus,
  )
  status?: VendorStatus;

  @IsOptional()
  @IsEnum(
    VendorMarketplaceStatus,
  )
  marketplaceStatus?:
    VendorMarketplaceStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}