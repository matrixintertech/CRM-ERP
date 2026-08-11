import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  PermissionScope,
  PermissionType,
  Status,
  UserType,
} from "@prisma/client";

import {
  AuthorizationRepository,
} from "../repositories/authorization.repository";

import type {
  AuthorizationUserContext,
  EffectiveAuthorization,
  EffectiveCompanyPermission,
  EffectivePlatformPermission,
} from "../types/authorization.types";

@Injectable()
export class EffectivePermissionService {
  constructor(
    private readonly authorizationRepository:
      AuthorizationRepository,
  ) {}

  /*
   * Complete authorization context
   * for one authenticated user.
   *
   * PLATFORM_OWNER:
   * → PlatformRole permissions
   *
   * Company user:
   * → RolePermission + UserPermission
   */
  async getAuthorization(
    userId: bigint,
  ): Promise<EffectiveAuthorization> {
    const user =
      await this.authorizationRepository
        .findUserContext(
          userId,
        );

    if (!user) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    const userContext:
      AuthorizationUserContext = {
        id:
          user.id,

        uuid:
          user.uuid,

        userType:
          user.userType,

        companyId:
          user.companyId,

        employeeId:
          user.employeeId,

        roleId:
          user.roleId,

        platformRoleId:
          user.platformRoleId,
      };

    /*
     * Platform users and company users
     * have completely separate
     * authorization paths.
     */
    if (
      user.userType ===
      UserType.PLATFORM_OWNER
    ) {
      const platformPermissions =
        await this.resolvePlatformPermissions(
          userId,
        );

      return {
        user:
          userContext,

        platformPermissions,

        companyPermissions:
          [],
      };
    }

    const companyPermissions =
      await this.resolveCompanyPermissions(
        userId,
      );

    return {
      user:
        userContext,

      platformPermissions:
        [],

      companyPermissions,
    };
  }

  /*
   * Resolve PLATFORM permissions.
   *
   * PlatformRolePermission has no scope.
   */
  async resolvePlatformPermissions(
    userId: bigint,
  ): Promise<
    EffectivePlatformPermission[]
  > {
    const user =
      await this.authorizationRepository
        .findPlatformPermissions(
          userId,
        );

    if (
      !user ||
      user.userType !==
        UserType.PLATFORM_OWNER
    ) {
      return [];
    }

    const platformRole =
      user.platformRole;

    /*
     * No PlatformRole = no platform
     * permissions.
     *
     * No hardcoded super-admin bypass.
     */
    if (
      !platformRole ||
      platformRole.deletedAt ||
      platformRole.status !==
        Status.ACTIVE
    ) {
      return [];
    }

    const permissionMap =
      new Map<
        string,
        EffectivePlatformPermission
      >();

    for (
      const item
      of platformRole.permissions
    ) {
      const permission =
        item.permission;

      permissionMap.set(
        permission.code,
        {
          permissionId:
            permission.id,

          permissionUuid:
            permission.uuid,

          module:
            permission.module,

          name:
            permission.name,

          code:
            permission.code,

          type:
            PermissionType.PLATFORM,

          source:
            "PLATFORM_ROLE",
        },
      );
    }

    return Array.from(
      permissionMap.values(),
    );
  }

  /*
   * Resolve COMPANY permissions.
   *
   * Sources:
   * 1. RolePermission
   * 2. UserPermission
   *
   * Same permission can exist with
   * different scopes.
   *
   * Example:
   *
   * TASK_VIEW → OWN     [ROLE]
   * TASK_VIEW → PROJECT [USER]
   *
   * Both grants remain effective.
   */
  async resolveCompanyPermissions(
    userId: bigint,
  ): Promise<
    EffectiveCompanyPermission[]
  > {
    const user =
      await this.authorizationRepository
        .findCompanyPermissions(
          userId,
        );

    if (
      !user ||
      user.userType ===
        UserType.PLATFORM_OWNER
    ) {
      return [];
    }

    /*
     * Key:
     *
     * permissionCode:scope
     *
     * Isse same permission ke
     * multiple scopes preserve rahenge.
     */
    const permissionMap =
      new Map<
        string,
        EffectiveCompanyPermission
      >();

    const role =
      user.role;

    /*
     * Inactive/deleted Role ke grants
     * effective nahi honge.
     */
    if (
      role &&
      !role.deletedAt &&
      role.status ===
        Status.ACTIVE
    ) {
      for (
        const item
        of role.rolePermissions
      ) {
        const permission =
          item.permission;

        const key =
          this.buildCompanyGrantKey(
            permission.code,
            item.scope,
          );

        permissionMap.set(
          key,
          {
            permissionId:
              permission.id,

            permissionUuid:
              permission.uuid,

            module:
              permission.module,

            name:
              permission.name,

            code:
              permission.code,

            type:
              PermissionType.COMPANY,

            source:
              "ROLE",

            scope:
              item.scope,
          },
        );
      }
    }

    /*
     * Direct UserPermission grants.
     *
     * User grant same permission +
     * same scope ho to ROLE entry ko
     * replace karega.
     *
     * Different scope ho to dono
     * grants preserve rahenge.
     */
    for (
      const item
      of user.extraPermissions
    ) {
      const permission =
        item.permission;

      const key =
        this.buildCompanyGrantKey(
          permission.code,
          item.scope,
        );

      permissionMap.set(
        key,
        {
          permissionId:
            permission.id,

          permissionUuid:
            permission.uuid,

          module:
            permission.module,

          name:
            permission.name,

          code:
            permission.code,

          type:
            PermissionType.COMPANY,

          source:
            "USER",

          scope:
            item.scope,
        },
      );
    }

    return Array.from(
      permissionMap.values(),
    );
  }

  /*
   * Check PLATFORM capability.
   *
   * Example:
   * PLATFORM_ROLE_VIEW
   */
  async hasPlatformPermission(
    userId: bigint,
    permissionCode: string,
  ): Promise<boolean> {
    const permissions =
      await this.resolvePlatformPermissions(
        userId,
      );

    return permissions.some(
      (permission) =>
        permission.code ===
        permissionCode,
    );
  }

  /*
   * Check whether company user has
   * this capability in at least one
   * scope.
   *
   * Scope applicability to actual
   * resource PermissionScopeService
   * later decide karega.
   */
  async hasCompanyPermission(
    userId: bigint,
    permissionCode: string,
  ): Promise<boolean> {
    const permissions =
      await this.resolveCompanyPermissions(
        userId,
      );

    return permissions.some(
      (permission) =>
        permission.code ===
        permissionCode,
    );
  }

  /*
   * Get all effective scopes for
   * one company permission.
   *
   * Example:
   *
   * TASK_VIEW
   * → [OWN, PROJECT]
   */
  async getCompanyPermissionScopes(
    userId: bigint,
    permissionCode: string,
  ): Promise<
    PermissionScope[]
  > {
    const permissions =
      await this.resolveCompanyPermissions(
        userId,
      );

    return Array.from(
      new Set(
        permissions
          .filter(
            (permission) =>
              permission.code ===
              permissionCode,
          )
          .map(
            (permission) =>
              permission.scope,
          ),
      ),
    );
  }

  /*
   * Useful for PermissionGuard.
   *
   * Boundary automatically selected
   * using current userType.
   */
  async hasPermission(
    userId: bigint,
    permissionCode: string,
  ): Promise<boolean> {
    const context =
      await this.authorizationRepository
        .findUserContext(
          userId,
        );

    if (!context) {
      return false;
    }

    if (
      context.userType ===
      UserType.PLATFORM_OWNER
    ) {
      return this.hasPlatformPermission(
        userId,
        permissionCode,
      );
    }

    return this.hasCompanyPermission(
      userId,
      permissionCode,
    );
  }

  private buildCompanyGrantKey(
    permissionCode: string,
    scope: PermissionScope,
  ): string {
    return `${permissionCode}:${scope}`;
  }
}