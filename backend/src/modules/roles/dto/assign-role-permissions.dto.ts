import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from "class-validator";

export class AssignRolePermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  permissionIds: number[];
}