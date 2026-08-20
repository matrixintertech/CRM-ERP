import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

import {
  Type,
} from "class-transformer";


export class CreateVendorCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;


  @IsString()
  @MaxLength(50)
  code: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}