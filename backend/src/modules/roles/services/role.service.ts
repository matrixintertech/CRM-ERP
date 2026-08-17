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


interface AuthUser {
  id: bigint;
}


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
   * Dedicated COMPANY permission
   * catalog for Role Permission
   * Management.
   *
   * Controller permission:
   * company.role.update
   *
   * This intentionally does not
   * depend on:
   * company.permission.view
   */
  async findPermissionCatalog(
    user: AuthUser,
  ) {
    /*
     * Resolve company boundary first.
     *
     * Even though permission records
     * themselves are global COMPANY
     * permission definitions, only a
     * valid company user can access
     * this catalog through this flow.
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
      dto.name?.trim();


    const normalizedCode =
      dto.code
        ?.trim()
        .toUpperCase()
        .replace(
          /\s+/g,
          "_",
        );


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