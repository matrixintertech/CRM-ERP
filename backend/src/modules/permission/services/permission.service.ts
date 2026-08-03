import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PermissionRepository } from "../repositories/permission.repository";

import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository:
      PermissionRepository,
  ) {}

  async create(
    dto: CreatePermissionDto,
  ) {
    const normalizedCode =
      dto.code
        .trim()
        .toLowerCase();

    const existingPermission =
      await this.permissionRepository.findByCode(
        normalizedCode,
      );

    if (existingPermission) {
      throw new ConflictException(
        "Permission code already exists.",
      );
    }

    const permission =
      await this.permissionRepository.create({
        ...dto,

        module:
          dto.module,

        name:
          dto.name.trim(),

        code:
          normalizedCode,

        description:
          dto.description?.trim(),
      });

    return {
      message:
        "Permission created successfully.",

      permission,
    };
  }

  async findAll() {
    const permissions =
      await this.permissionRepository.findAll();

    return {
      message:
        "Permissions fetched successfully.",

      permissions,
    };
  }

  async findOne(
    id: bigint,
  ) {
    const permission =
      await this.permissionRepository.findById(
        id,
      );

    if (!permission) {
      throw new NotFoundException(
        "Permission not found.",
      );
    }

    return {
      message:
        "Permission fetched successfully.",

      permission,
    };
  }

  async update(
    id: bigint,
    dto: UpdatePermissionDto,
  ) {
    const existingPermission =
      await this.permissionRepository.findById(
        id,
      );

    if (!existingPermission) {
      throw new NotFoundException(
        "Permission not found.",
      );
    }

    const normalizedCode =
      dto.code
        ?.trim()
        .toLowerCase();

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
        duplicatePermission.id !== id
      ) {
        throw new ConflictException(
          "Permission code already exists.",
        );
      }
    }

    const permission =
      await this.permissionRepository.update(
        id,
        {
          ...(dto.module !== undefined && {
            module:
              dto.module,
          }),

          ...(dto.name !== undefined && {
            name:
              dto.name.trim(),
          }),

          ...(normalizedCode !== undefined && {
            code:
              normalizedCode,
          }),

          ...(dto.description !==
            undefined && {
            description:
              dto.description.trim(),
          }),

          ...(dto.status !== undefined && {
            status:
              dto.status,
          }),
        },
      );

    return {
      message:
        "Permission updated successfully.",

      permission,
    };
  }

async remove(
  id: bigint,
) {
  const existingPermission =
    await this.permissionRepository.findById(
      id,
    );

  if (!existingPermission) {
    throw new NotFoundException(
      "Permission not found.",
    );
  }

  const permission =
    await this.permissionRepository.softDelete(
      id,
    );

  return {
    message:
      "Permission deleted successfully.",

    permission,
  };
}

async findGrouped() {
  const permissions =
    await this.permissionRepository.findGrouped();

  type PermissionItem =
    (typeof permissions)[number];

  const grouped: Record<
    string,
    PermissionItem[]
  > = {};

  for (const permission of permissions) {
    const module =
      permission.module;

    if (!grouped[module]) {
      grouped[module] = [];
    }

    grouped[module].push(
      permission,
    );
  }

  const permissionGroups =
    Object.entries(grouped).map(
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
      "Grouped permissions fetched successfully.",

    permissionGroups,
  };
}
}