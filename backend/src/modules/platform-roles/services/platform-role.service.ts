import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import {
  PlatformRoleRepository,
} from "../repositories/platform-role.repository";

import {
  CreatePlatformRoleDto,
} from "../dto/create-platform-role.dto";

import {
  UpdatePlatformRoleDto,
} from "../dto/update-platform-role.dto";

import {
  AssignPlatformRolePermissionsDto,
} from "../dto/assign-platform-role-permissions.dto";

@Injectable()
export class PlatformRoleService {
  constructor(
    private readonly platformRoleRepository:
      PlatformRoleRepository,
  ) {}

  /*
   * Create platform role.
   */
async create(
  dto: CreatePlatformRoleDto,
) {
  const name =
    dto.name.trim();

  const code =
    dto.code
      .trim()
      .toUpperCase();

  const existingCode =
    await this.platformRoleRepository
      .findByCode(
        code,
      );

  if (existingCode) {
    throw new ConflictException(
      "Platform role code already exists.",
    );
  }

  const existingName =
    await this.platformRoleRepository
      .findByName(
        name,
      );

  if (existingName) {
    throw new ConflictException(
      "Platform role name already exists.",
    );
  }

  try {
    const role =
      await this.platformRoleRepository
        .create({
          name,

          code,

          description:
            dto.description
              ?.trim() ||
            null,

          isSystem:
            dto.isSystem ??
            false,

          status:
            Status.ACTIVE,
        });

    return {
      message:
        "Platform role created successfully.",

      role,
    };
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code ===
        "P2002"
    ) {
      const target =
        error.meta?.target;

      if (
        Array.isArray(target) &&
        target.includes(
          "code",
        )
      ) {
        throw new ConflictException(
          "Platform role code already exists.",
        );
      }

      if (
        Array.isArray(target) &&
        target.includes(
          "name",
        )
      ) {
        throw new ConflictException(
          "Platform role name already exists.",
        );
      }

      throw new ConflictException(
        "Platform role already exists.",
      );
    }

    throw error;
  }
}

  /*
   * Get all platform roles.
   */
  async findAll(
    params: {
      status?: Status;
      search?: string;
    } = {},
  ) {
    const roles =
      await this.platformRoleRepository
        .findAll(
          params,
        );

    return {
      message:
        "Platform roles fetched successfully.",

      roles,
    };
  }

  /*
   * Dropdown.
   */
  async findDropdown() {
    const roles =
      await this.platformRoleRepository
        .findDropdown();

    return {
      message:
        "Platform role dropdown fetched successfully.",

      roles,
    };
  }

  /*
   * Get one role.
   */
  async findByUuid(
    uuid: string,
  ) {
    const role =
      await this.platformRoleRepository
        .findByUuid(
          uuid,
        );

    if (!role) {
      throw new NotFoundException(
        "Platform role not found.",
      );
    }

    return {
      message:
        "Platform role fetched successfully.",

      role,
    };
  }

  /*
   * Update role.
   */
 async update(
  uuid: string,
  dto: UpdatePlatformRoleDto,
) {
  const role =
    await this.platformRoleRepository
      .findByUuid(
        uuid,
      );

  if (!role) {
    throw new NotFoundException(
      "Platform role not found.",
    );
  }

  const name =
    dto.name !== undefined
      ? dto.name.trim()
      : undefined;

  const code =
    dto.code !== undefined
      ? dto.code
          .trim()
          .toUpperCase()
      : undefined;

  if (
    code !== undefined &&
    code !== role.code
  ) {
    const existingCode =
      await this.platformRoleRepository
        .findByCode(
          code,
        );

    if (
      existingCode &&
      existingCode.id !==
        role.id
    ) {
      throw new ConflictException(
        "Platform role code already exists.",
      );
    }
  }

  if (
    name !== undefined &&
    name !== role.name
  ) {
    const existingName =
      await this.platformRoleRepository
        .findByName(
          name,
        );

    if (
      existingName &&
      existingName.id !==
        role.id
    ) {
      throw new ConflictException(
        "Platform role name already exists.",
      );
    }
  }

  try {
    const updatedRole =
      await this.platformRoleRepository
        .update(
          role.id,
          {
            ...(name !==
              undefined && {
              name,
            }),

            ...(code !==
              undefined && {
              code,
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

    return {
      message:
        "Platform role updated successfully.",

      role:
        updatedRole,
    };
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code ===
        "P2002"
    ) {
      const target =
        error.meta?.target;

      if (
        Array.isArray(target) &&
        target.includes(
          "code",
        )
      ) {
        throw new ConflictException(
          "Platform role code already exists.",
        );
      }

      if (
        Array.isArray(target) &&
        target.includes(
          "name",
        )
      ) {
        throw new ConflictException(
          "Platform role name already exists.",
        );
      }

      throw new ConflictException(
        "Platform role already exists.",
      );
    }

    throw error;
  }
}

  /*
   * Soft delete.
   */
  async remove(
    uuid: string,
  ) {
    const role =
      await this.platformRoleRepository
        .findByUuid(
          uuid,
        );

    if (!role) {
      throw new NotFoundException(
        "Platform role not found.",
      );
    }

    if (
      role.isSystem
    ) {
      throw new BadRequestException(
        "System platform role cannot be deleted.",
      );
    }

    if (
      role._count.users >
      0
    ) {
      throw new BadRequestException(
        "Platform role cannot be deleted while users are assigned to it.",
      );
    }

    await this.platformRoleRepository
      .softDelete(
        role.id,
      );

    return {
      message:
        "Platform role deleted successfully.",
    };
  }

  /*
   * Get PLATFORM permissions
   * assigned to role.
   */
  async findPermissions(
    roleUuid: string,
  ) {
    const result =
      await this.platformRoleRepository
        .findRolePermissions(
          roleUuid,
        );

    if (!result) {
      throw new NotFoundException(
        "Platform role not found.",
      );
    }

    const permissions =
      result.rolePermissions.map(
        (item) =>
          item.permission,
      );

    return {
      message:
        "Platform role permissions fetched successfully.",

      role: {
        uuid:
          result.role.uuid,

        name:
          result.role.name,

        code:
          result.role.code,
      },

      permissions,
    };
  }

  /*
   * Replace PlatformRole permissions.
   *
   * Repository only resolves:
   * PermissionType.PLATFORM
   */
  async assignPermissions(
    roleUuid: string,
    dto:
      AssignPlatformRolePermissionsDto,
  ) {
    const result =
      await this.platformRoleRepository
        .assignPermissions(
          roleUuid,
          dto.permissionUuids,
        );

    if (!result) {
      throw new NotFoundException(
        "Platform role not found.",
      );
    }

    if (
      result.requestedPermissionCount !==
      result.assignedPermissionCount
    ) {
      throw new BadRequestException(
        "One or more permissions were not found, inactive, or not valid for platform roles.",
      );
    }

    return {
      message:
        "Platform role permissions assigned successfully.",

      role: {
        uuid:
          result.role.uuid,

        name:
          result.role.name,

        code:
          result.role.code,
      },

      permissions:
        result.permissions,
    };
  }
}