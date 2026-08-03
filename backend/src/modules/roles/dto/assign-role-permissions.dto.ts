import { ApiProperty } from "@nestjs/swagger";

import {
  ArrayUnique,
  IsArray,
  IsUUID,
} from "class-validator";

export class AssignRolePermissionsDto {
  @ApiProperty({
    description:
      "Permission UUIDs. Empty array removes all permissions.",
    example: [],
    type: [String],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", {
    each: true,
  })
  permissionUuids: string[];
}