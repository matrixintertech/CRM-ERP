import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
} from "@prisma/client";

import {
  CreateRoleDto,
} from "../dto/create-role.dto";

import {
  UpdateRoleDto,
} from "../dto/update-role.dto";

import {
  AssignRolePermissionsDto,
} from "../dto/assign-role-permissions.dto";

import {
  RoleRepository,
} from "../repositories/role.repository";

import {
  CompanyBoundaryService,
} from "../../authorization/services/company-boundary.service";

import {
  COMPANY_ADMIN_PERMISSION_TEMPLATE,
} from "../../authorization/permissions/company-admin-template";

import {
  COMPANY_ADMIN_ROLE_CODE,
} from "../../authorization/services/company-authorization-bootstrap.service";


interface AuthUser {
  id: bigint;
}


const REQUIRED_COMPANY_ADMIN_PERMISSIONS =
  COMPANY_ADMIN_PERMISSION_TEMPLATE.filter(
    (permission) =>
      permission.required,
  );


@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository:
      RoleRepository,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}


  private async getCompanyId(
    user: AuthUser,
  ) {
    return this.companyBoundaryService
      .getCompanyId(
        user.id,
      );
  }


  /*
   * =========================================================
   * CREATE ROLE
   * =========================================================
   */
  async create(
    user: AuthUser,
    dto: CreateRoleDto,
    tx?: Prisma.TransactionClient,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const company =
      await this.roleRepository
        .findCompanyById(
          companyId,
        );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    const normalizedName =
      dto.name.trim();


    const normalizedCode =
      dto.code
        .trim()
        .toUpperCase()
        .replace(
          /\s+/g,
          "_",
        );


    /*
     * COMPANY_ADMIN is reserved for the
     * system-created Company Admin role.
     *
     * Company users cannot manually create
     * another role using this code.
     */
    if (
      normalizedCode ===
      COMPANY_ADMIN_ROLE_CODE
    ) {
      throw new ConflictException(
        "COMPANY_ADMIN is a reserved system role code.",
      );
    }


    const existingCode =
      await this.roleRepository
        .findByCode(
          companyId,
          normalizedCode,
        );


    if (existingCode) {
      throw new ConflictException(
        "Role code already exists.",
      );
    }


    const existingName =
      await this.roleRepository
        .findByName(
          companyId,
          normalizedName,
        );


    if (existingName) {
      throw new ConflictException(
        "Role name already exists.",
      );
    }


    const role =
      await this.roleRepository.create(
        {
          company: {
            connect: {
              id:
                companyId,
            },
          },

          name:
            normalizedName,

          code:
            normalizedCode,

          description:
            dto.description
              ?.trim(),

          /*
           * Client cannot create
           * system roles.
           */
          isSystem:
            false,
        },
        tx,
      );


    return {
      message:
        "Role created successfully.",

      role,
    };
  }


  /*
   * =========================================================
   * GET ALL ROLES
   * =========================================================
   */
  async findAll(
    user: AuthUser,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const company =
      await this.roleRepository
        .findCompanyById(
          companyId,
        );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    const roles =
      await this.roleRepository
        .findByCompanyId(
          companyId,
        );


    return {
      message:
        "Roles fetched successfully.",

      roles,
    };
  }


  /*
   * =========================================================
   * ROLE DROPDOWN
   * =========================================================
   */
  async findDropdown(
    user: AuthUser,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const roles =
      await this.roleRepository
        .findActiveByCompanyId(
          companyId,
        );


    return {
      message:
        "Role dropdown fetched successfully.",

      roles,
    };
  }


  /*
   * =========================================================
   * ROLE PERMISSION CATALOG
   * =========================================================
   *
   * Dedicated COMPANY permission catalog for
   * Role Permission Management.
   *
   * Controller permission:
   * company.role.update
   *
   * This intentionally does not depend on:
   * company.permission.view
   */
  async findPermissionCatalog(
    user: AuthUser,
  ) {
    /*
     * Resolve company boundary first.
     *
     * Permission records themselves are global
     * COMPANY permission definitions, but only a
     * valid company user can access this catalog
     * through this flow.
     */
    await this.getCompanyId(
      user,
    );


    const permissions =
      await this.roleRepository
        .findPermissionCatalog();


    /*
     * Group permissions by module
     * for Role Permission UI.
     */
    const groupedPermissionMap =
      new Map<
        string,
        typeof permissions
      >();


    for (
      const permission
      of permissions
    ) {
      const existing =
        groupedPermissionMap.get(
          permission.module,
        ) ?? [];


      existing.push(
        permission,
      );


      groupedPermissionMap.set(
        permission.module,
        existing,
      );
    }


    const groups =
      Array.from(
        groupedPermissionMap.entries(),
      ).map(
        (
          [
            module,
            modulePermissions,
          ],
        ) => ({
          module,

          permissions:
            modulePermissions,
        }),
      );


    return {
      message:
        "Company role permission catalog fetched successfully.",

      groups,
    };
  }


  /*
   * =========================================================
   * GET ROLE
   * =========================================================
   */
  async findOne(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const role =
      await this.roleRepository
        .findByUuid(
          companyId,
          uuid,
        );


    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    return {
      message:
        "Role fetched successfully.",

      role,
    };
  }


  /*
   * =========================================================
   * UPDATE ROLE
   * =========================================================
   */
  async update(
    user: AuthUser,
    uuid: string,
    dto: UpdateRoleDto,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const existingRole =
      await this.roleRepository
        .findByUuid(
          companyId,
          uuid,
        );


    if (!existingRole) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    const normalizedName =
      dto.name
        ?.trim();


    const normalizedCode =
      dto.code
        ?.trim()
        .toUpperCase()
        .replace(
          /\s+/g,
          "_",
        );


    const isCompanyAdminSystemRole =
      existingRole.isSystem &&
      existingRole.code ===
        COMPANY_ADMIN_ROLE_CODE;


    /*
     * -------------------------------------------------------
     * Company Admin system role protection
     * -------------------------------------------------------
     */
    if (
      isCompanyAdminSystemRole
    ) {
      /*
       * COMPANY_ADMIN code is immutable.
       */
      if (
        normalizedCode !==
          undefined &&
        normalizedCode !==
          existingRole.code
      ) {
        throw new ConflictException(
          "Company Admin system role code cannot be changed.",
        );
      }


      /*
       * Company Admin role must always
       * remain active.
       */
      if (
        dto.status !==
          undefined &&
        dto.status !==
          "ACTIVE"
      ) {
        throw new ConflictException(
          "Company Admin system role cannot be deactivated.",
        );
      }
    }


    /*
     * Custom/non-system roles cannot be
     * renamed to the reserved COMPANY_ADMIN code.
     */
    if (
      normalizedCode ===
        COMPANY_ADMIN_ROLE_CODE &&
      existingRole.code !==
        COMPANY_ADMIN_ROLE_CODE
    ) {
      throw new ConflictException(
        "COMPANY_ADMIN is a reserved system role code.",
      );
    }


    if (
      normalizedCode !==
        undefined &&
      normalizedCode !==
        existingRole.code
    ) {
      const duplicateCode =
        await this.roleRepository
          .findByCode(
            companyId,
            normalizedCode,
          );


      if (
        duplicateCode &&
        duplicateCode.uuid !==
          uuid
      ) {
        throw new ConflictException(
          "Role code already exists.",
        );
      }
    }


    if (
      normalizedName !==
        undefined &&
      normalizedName !==
        existingRole.name
    ) {
      const duplicateName =
        await this.roleRepository
          .findByName(
            companyId,
            normalizedName,
          );


      if (
        duplicateName &&
        duplicateName.uuid !==
          uuid
      ) {
        throw new ConflictException(
          "Role name already exists.",
        );
      }
    }


    const updatedRole =
      await this.roleRepository.update(
        companyId,
        uuid,
        {
          ...(normalizedName !==
            undefined && {
            name:
              normalizedName,
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
                .trim() ||
              null,
          }),

          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),
        },
      );


    if (!updatedRole) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    return {
      message:
        "Role updated successfully.",

      role:
        updatedRole,
    };
  }


  /*
   * =========================================================
   * DELETE ROLE
   * =========================================================
   */
  async delete(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const role =
      await this.roleRepository
        .findByUuid(
          companyId,
          uuid,
        );


    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    /*
     * All system roles are protected
     * from deletion.
     */
    if (
      role.isSystem
    ) {
      throw new ConflictException(
        "System role cannot be deleted.",
      );
    }


    const userCount =
      await this.roleRepository
        .countUsers(
          companyId,
          uuid,
        );


    if (
      userCount >
      0
    ) {
      throw new ConflictException(
        "Role cannot be deleted because users are assigned to it.",
      );
    }


    await this.roleRepository
      .softDelete(
        companyId,
        uuid,
      );


    return {
      message:
        "Role deleted successfully.",
    };
  }


  /*
   * =========================================================
   * GET ROLE PERMISSIONS
   * =========================================================
   */
  async findRolePermissions(
    user: AuthUser,
    roleUuid: string,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const role =
      await this.roleRepository
        .findByUuid(
          companyId,
          roleUuid,
        );


    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    const rolePermissions =
      await this.roleRepository
        .findRolePermissions(
          companyId,
          roleUuid,
        );


    const permissions =
      rolePermissions.map(
        (
          item,
        ) => ({
          ...item.permission,

          scope:
            item.scope,
        }),
      );


    return {
      message:
        "Role permissions fetched successfully.",

      role: {
        uuid:
          role.uuid,

        name:
          role.name,

        code:
          role.code,
      },

      permissions,
    };
  }


  /*
   * =========================================================
   * ASSIGN ROLE PERMISSIONS
   * =========================================================
   */
  async assignPermissions(
    user: AuthUser,
    roleUuid: string,
    dto: AssignRolePermissionsDto,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );


    const role =
      await this.roleRepository
        .findByUuid(
          companyId,
          roleUuid,
        );


    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    const isCompanyAdminSystemRole =
      role.isSystem &&
      role.code ===
        COMPANY_ADMIN_ROLE_CODE;


    /*
     * -------------------------------------------------------
     * Company Admin lockout protection
     * -------------------------------------------------------
     *
     * Required permissions:
     *
     * - cannot be removed
     * - required scope cannot be changed
     *
     * Optional permissions remain configurable.
     */
    if (
      isCompanyAdminSystemRole
    ) {
      const permissionCatalog =
        await this.roleRepository
          .findPermissionCatalog();


      const permissionByCode =
        new Map(
          permissionCatalog.map(
            (permission) => [
              permission.code,
              permission,
            ],
          ),
        );


      for (
        const requiredPermission
        of REQUIRED_COMPANY_ADMIN_PERMISSIONS
      ) {
        const catalogPermission =
          permissionByCode.get(
            requiredPermission.code,
          );


        /*
         * Required permission missing from
         * active COMPANY catalog means server
         * configuration is inconsistent.
         */
        if (!catalogPermission) {
          throw new ConflictException(
            `Required Company Admin permission is unavailable: ${requiredPermission.code}`,
          );
        }


        const requestedAssignment =
          dto.permissions.find(
            (assignment) =>
              assignment.permissionUuid ===
              catalogPermission.uuid,
          );


        /*
         * Required permission cannot be
         * removed from the replacement set.
         */
        if (!requestedAssignment) {
          throw new ConflictException(
            `Required Company Admin permission cannot be removed: ${requiredPermission.code}`,
          );
        }


        /*
         * Required permission scope is
         * also locked.
         */
        if (
          requestedAssignment.scope !==
          requiredPermission.scope
        ) {
          throw new ConflictException(
            `Required Company Admin permission ${requiredPermission.code} must use ${requiredPermission.scope} scope.`,
          );
        }
      }
    }


    const result =
      await this.roleRepository
        .assignPermissions(
          companyId,
          roleUuid,
          dto.permissions,
        );


    if (!result) {
      throw new NotFoundException(
        "Role not found.",
      );
    }


    return {
      message:
        "Permissions assigned successfully.",

      roleUuid,

      permissions:
        result.assignedPermissions,
    };
  }
}