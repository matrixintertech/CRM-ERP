import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import {
  Transform,
  Type,
} from "class-transformer";


export class GetSubscriptionPlansDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;


  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string"
      ? value.trim()
      : value,
  )
  @IsString()
  search?: string;
}