import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator';

export class AssignUserPermissionsDto {
  @ApiProperty({
    type: [String],
    example: [
      '2f4e1216-a8e9-48c7-a5ac-4cf352b44e0e',
      '718a49d2-634a-4b6d-8ad4-8cac1dff2a23',
    ],
    description:
      'Additional permission UUIDs assigned directly to the user',
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', {
    each: true,
  })
  permissionUuids: string[];
}