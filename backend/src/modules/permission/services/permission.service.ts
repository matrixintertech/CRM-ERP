import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PermissionScope,
  PermissionType,
} from '@prisma/client';

import {
  PermissionRepository,
} from '../repositories/permission.repository';

import type {
  FindPermissionsParams,
} from '../repositories/permission.repository';

import {
  CreatePermissionDto,
} from '../dto/create-permission.dto';

import {
  UpdatePermissionDto,
} from '../dto/update-permission.dto';


@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository:
      PermissionRepository,
  ) {}


  /*
   * Platform-specific permission modules.
   */
private readonly platformModules =
  new Set<string>([
    "PLATFORM_COMPANY",
    "PLATFORM_ROLE",
    "PLATFORM_USER",
    "PLATFORM_PERMISSION",
    "PLATFORM_MODULE",
    "PLATFORM_SUBSCRIPTION_PLAN",
  ]);


  /*
   * Permission type aur module
   * same authorization boundary ke
   * hone chahiye.
   */
  private validateModuleForType(
    type: PermissionType,
    module: string,
  ): void {
    const isPlatformModule =
      this.platformModules.has(
        module,
      );

    if (
      type ===
        PermissionType.PLATFORM &&
      !isPlatformModule
    ) {
      throw new BadRequestException(
        'Platform permissions must use a platform permission module.',
      );
    }

    if (
      type ===
        PermissionType.COMPANY &&
      isPlatformModule
    ) {
      throw new BadRequestException(
        'Company permissions cannot use a platform permission module.',
      );
    }
  }


  /*
   * Permission code boundary should
   * match PermissionType.
   */
  private validateCodeForType(
    type: PermissionType,
    code: string,
  ): void {
    if (
      type ===
        PermissionType.PLATFORM &&
      !code.startsWith(
        'platform.',
      )
    ) {
      throw new BadRequestException(
        'Platform permission code must start with "platform.".',
      );
    }

    if (
      type ===
        PermissionType.COMPANY &&
      !code.startsWith(
        'company.',
      )
    ) {
      throw new BadRequestException(
        'Company permission code must start with "company.".',
      );
    }
  }


  private normalizeAllowedScopes(
    type: PermissionType,
    allowedScopes:
      PermissionScope[],
  ): PermissionScope[] {
    const scopes =
      Array.from(
        new Set(
          allowedScopes,
        ),
      );

    if (
      type ===
      PermissionType.PLATFORM
    ) {
      if (
        scopes.length >
        0
      ) {
        throw new BadRequestException(
          'Platform permissions cannot have scopes.',
        );
      }

      return [];
    }

    if (
      type ===
        PermissionType.COMPANY &&
      scopes.length ===
        0
    ) {
      throw new BadRequestException(
        'Company permissions must have at least one allowed scope.',
      );
    }

    return scopes;
  }


  async create(
    dto: CreatePermissionDto,
  ) {
    const normalizedCode =
      dto.code
        .trim()
        .toLowerCase();


    /*
     * Boundary validation.
     */
    this.validateModuleForType(
      dto.type,
      dto.module,
    );

    this.validateCodeForType(
      dto.type,
      normalizedCode,
    );


    const existingPermission =
      await this.permissionRepository.findByCode(
        normalizedCode,
      );

    if (
      existingPermission
    ) {
      throw new ConflictException(
        'Permission code already exists.',
      );
    }


    const allowedScopes =
      this.normalizeAllowedScopes(
        dto.type,
        dto.allowedScopes,
      );


    const permission =
      await this.permissionRepository.create({
        ...dto,

        module:
          dto.module,

        type:
          dto.type,

        name:
          dto.name.trim(),

        code:
          normalizedCode,

        allowedScopes,

        description:
          dto.description
            ?.trim(),
      });


    return {
      message:
        'Permission created successfully.',

      permission,
    };
  }


  async findAll(
    params:
      FindPermissionsParams = {},
  ) {
    const [
      result,
      modules,
    ] =
      await Promise.all([
        this.permissionRepository.findAll(
          params,
        ),

        this.permissionRepository.findModules(
          params.type,
        ),
      ]);


    return {
      message:
        'Permissions fetched successfully.',

      permissions:
        result.permissions,

      pagination:
        result.pagination,

      filters: {
        modules,

        types:
          Object.values(
            PermissionType,
          ),
      },
    };
  }


  async findOne(
    uuid: string,
  ) {
    const permission =
      await this.permissionRepository.findByUuid(
        uuid,
      );

    if (!permission) {
      throw new NotFoundException(
        'Permission not found.',
      );
    }

    return {
      message:
        'Permission fetched successfully.',

      permission,
    };
  }


  async update(
    uuid: string,
    dto: UpdatePermissionDto,
  ) {
    const existingPermission =
      await this.permissionRepository.findByUuid(
        uuid,
      );

    if (
      !existingPermission
    ) {
      throw new NotFoundException(
        'Permission not found.',
      );
    }


    const normalizedCode =
      dto.code
        ?.trim()
        .toLowerCase();


    /*
     * Effective values calculate karo,
     * because type/module individually
     * update ho sakte hain.
     */
    const effectiveType =
      dto.type ??
      existingPermission.type;

    const effectiveModule =
      dto.module ??
      existingPermission.module;

    const effectiveCode =
      normalizedCode ??
      existingPermission.code;


    /*
     * Prevent:
     *
     * PLATFORM + USER
     * COMPANY + PLATFORM_USER
     */
    this.validateModuleForType(
      effectiveType,
      effectiveModule,
    );

    this.validateCodeForType(
      effectiveType,
      effectiveCode,
    );


    if (
      normalizedCode &&
      normalizedCode !==
        existingPermission.code
    ) {
      const duplicatePermission =
        await this.permissionRepository.findByCode(
          normalizedCode,
        );

      if (
        duplicatePermission &&
        duplicatePermission.uuid !==
          uuid
      ) {
        throw new ConflictException(
          'Permission code already exists.',
        );
      }
    }


    let allowedScopes:
      | PermissionScope[]
      | undefined;


    /*
     * PLATFORM permissions
     * scope-less hain.
     */
    if (
      effectiveType ===
      PermissionType.PLATFORM
    ) {
      if (
        dto.allowedScopes &&
        dto.allowedScopes.length >
          0
      ) {
        throw new BadRequestException(
          'Platform permissions cannot have scopes.',
        );
      }


      /*
       * COMPANY -> PLATFORM
       * hone par old scopes clear.
       */
      if (
        dto.type !==
          undefined ||
        dto.allowedScopes !==
          undefined
      ) {
        allowedScopes = [];
      }
    } else if (
      dto.allowedScopes !==
        undefined ||
      dto.type !==
        undefined
    ) {
      const effectiveScopes =
        dto.allowedScopes ??
        existingPermission.allowedScopes;

      allowedScopes =
        this.normalizeAllowedScopes(
          effectiveType,
          effectiveScopes,
        );
    }


    const permission =
      await this.permissionRepository.update(
        uuid,
        {
          ...(dto.module !==
            undefined && {
            module:
              dto.module,
          }),

          ...(dto.type !==
            undefined && {
            type:
              dto.type,
          }),

          ...(dto.name !==
            undefined && {
            name:
              dto.name.trim(),
          }),

          ...(normalizedCode !==
            undefined && {
            code:
              normalizedCode,
          }),

          ...(dto.description !==
            undefined && {
            description:
              dto.description
                .trim(),
          }),

          ...(allowedScopes !==
            undefined && {
            allowedScopes,
          }),

          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),
        },
      );


    return {
      message:
        'Permission updated successfully.',

      permission,
    };
  }


  async remove(
    uuid: string,
  ) {
    const existingPermission =
      await this.permissionRepository.findByUuid(
        uuid,
      );

    if (
      !existingPermission
    ) {
      throw new NotFoundException(
        'Permission not found.',
      );
    }


    const permission =
      await this.permissionRepository.softDelete(
        uuid,
      );


    return {
      message:
        'Permission deleted successfully.',

      permission,
    };
  }


  async findGrouped(
    type?:
      PermissionType,
  ) {
    const permissions =
      await this.permissionRepository.findGrouped(
        type,
      );

    type PermissionItem =
      (typeof permissions)[number];

    const grouped:
      Record<
        string,
        PermissionItem[]
      > = {};


    for (
      const permission
      of permissions
    ) {
      const module =
        permission.module;

      if (
        !grouped[
          module
        ]
      ) {
        grouped[
          module
        ] = [];
      }

      grouped[
        module
      ].push(
        permission,
      );
    }


    const permissionGroups =
      Object.entries(
        grouped,
      ).map(
        ([
          module,
          modulePermissions,
        ]) => ({
          module,

          permissions:
            modulePermissions,
        }),
      );


    return {
      message:
        'Grouped permissions fetched successfully.',

      type:
        type ??
        null,

      permissionGroups,
    };
  }
}