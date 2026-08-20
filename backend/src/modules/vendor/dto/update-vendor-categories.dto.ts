import {
  ArrayMinSize,
  IsArray,
  IsUUID,
  ValidateNested,
} from "class-validator";

import {
  Type,
} from "class-transformer";


export class VendorCategoryItemDto {
  @IsUUID()
  categoryUuid: string;
}


export class UpdateVendorCategoriesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      VendorCategoryItemDto,
  )
  categories:
    VendorCategoryItemDto[];

  @IsUUID()
  primaryCategoryUuid:
    string;
}