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

export class RolePermissionItemDto {
  @ApiProperty({
    description:
      'Permission UUID.',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  permissionUuid: string;

  @ApiProperty({
    description:
      'Selected scope for this permission. Must be one of the permission allowedScopes.',
    enum:
      PermissionScope,
    example:
      PermissionScope.COMPANY,
  })
  @IsEnum(
    PermissionScope,
  )
  scope:
    PermissionScope;
}

export class AssignRolePermissionsDto {
  @ApiProperty({
    description:
      'Permissions with their selected access scopes. Empty array removes all permissions.',
    type: [
      RolePermissionItemDto,
    ],
    example: [
      {
        permissionUuid:
          '550e8400-e29b-41d4-a716-446655440000',
        scope:
          'COMPANY',
      },
      {
        permissionUuid:
          '550e8400-e29b-41d4-a716-446655440001',
        scope:
          'PROJECT',
      },
    ],
  })
  @IsArray()
  @ArrayUnique(
    (
      item:
        RolePermissionItemDto,
    ) =>
      item.permissionUuid,
  )
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      RolePermissionItemDto,
  )
  permissions:
    RolePermissionItemDto[];
}