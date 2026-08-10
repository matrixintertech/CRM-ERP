import {
  ApiProperty,
} from "@nestjs/swagger";

import {
  ArrayUnique,
  IsArray,
  IsUUID,
} from "class-validator";

export class AssignPlatformRolePermissionsDto {
  @ApiProperty({
    description:
      "PLATFORM permission UUIDs assigned to this platform role. Empty array removes all permissions.",
    type: [String],
    example: [
      "2f4e1216-a8e9-48c7-a5ac-4cf352b44e0e",
      "718a49d2-634a-4b6d-8ad4-8cac1dff2a23",
    ],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", {
    each: true,
  })
  permissionUuids: string[];
}