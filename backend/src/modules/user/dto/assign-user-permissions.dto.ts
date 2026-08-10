import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  Type,
} from 'class-transformer';

import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import {
  PermissionScope,
} from '@prisma/client';

export class UserPermissionItemDto {
  @ApiProperty({
    description:
      'Permission UUID.',
    example:
      '2f4e1216-a8e9-48c7-a5ac-4cf352b44e0e',
  })
  @IsUUID('4')
  permissionUuid: string;

  @ApiProperty({
    description:
      'Data access scope for this direct user permission.',
    enum:
      PermissionScope,
    example:
      PermissionScope.OWN,
  })
  @IsEnum(
    PermissionScope,
  )
  scope: PermissionScope;
}

export class AssignUserPermissionsDto {
  @ApiProperty({
    description:
      'Additional permissions assigned directly to the user with access scope. Empty array removes all additional permissions.',
    type: [
      UserPermissionItemDto,
    ],
    example: [
      {
        permissionUuid:
          '2f4e1216-a8e9-48c7-a5ac-4cf352b44e0e',

        scope:
          'OWN',
      },
      {
        permissionUuid:
          '718a49d2-634a-4b6d-8ad4-8cac1dff2a23',

        scope:
          'PROJECT',
      },
    ],
  })
  @IsArray()
  @ArrayUnique(
    (
      item:
        UserPermissionItemDto,
    ) =>
      item.permissionUuid,
  )
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      UserPermissionItemDto,
  )
  permissions:
    UserPermissionItemDto[];
}