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
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(
    dto: CreatePermissionDto,
  ) {
    const exists =
      await this.permissionRepository.findByCode(
        dto.code,
      );

    if (exists) {
      throw new ConflictException(
        "Permission code already exists.",
      );
    }

    const permission =
      await this.permissionRepository.create(
        dto,
      );

    return permission;
  }

  async findAll() {
    return this.permissionRepository.findAll();
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

    return permission;
  }

  async update(
    id: bigint,
    dto: UpdatePermissionDto,
  ) {
    await this.findOne(id);

    if (dto.code) {
      const exists =
        await this.permissionRepository.findByCode(
          dto.code,
        );

      if (
        exists &&
        exists.id !== id
      ) {
        throw new ConflictException(
          "Permission code already exists.",
        );
      }
    }

    return this.permissionRepository.update(
      id,
      dto,
    );
  }

  async remove(
    id: bigint,
  ) {
    await this.findOne(id);

    return this.permissionRepository.delete(
      id,
    );
  }

  async findGrouped() {
  const permissions =
    await this.permissionRepository.findGrouped();

  const grouped = permissions.reduce(
    (acc, permission) => {
      const module = permission.module;

      if (!acc[module]) {
        acc[module] = [];
      }

      acc[module].push(permission);

      return acc;
    },
    {} as Record<string, typeof permissions>,
  );

  return Object.entries(grouped).map(
    ([module, permissions]) => ({
      module,
      permissions,
    }),
  );
}



}