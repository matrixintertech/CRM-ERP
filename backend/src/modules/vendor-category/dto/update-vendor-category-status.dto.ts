import {
  IsEnum,
} from "class-validator";

import {
  Status,
} from "@prisma/client";


export class UpdateVendorCategoryStatusDto {
  @IsEnum(
    Status,
  )
  status:
    Status;
}