import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Module } from "@prisma/client";

import { ModuleRepository } from "../repositories/module.repository";

import { CreateModuleDto } from "../dto/create-module.dto";
import { UpdateModuleDto } from "../dto/update-module.dto";

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async create(
    dto: CreateModuleDto,
  ) {
    const code = dto.code.trim().toUpperCase();
    const name = dto.name.trim();

    const codeExists =
      await this.moduleRepository.findByCode(
        code,
      );

    if (codeExists) {
      throw new ConflictException(
        "Module code already exists.",
      );
    }

    const nameExists =
      await this.moduleRepository.findByName(
        name,
      );

    if (nameExists) {
      throw new ConflictException(
        "Module name already exists.",
      );
    }

    let parent: Module | null = null;

    if (dto.parentId) {
      parent =
        await this.moduleRepository.findByUuid(
          dto.parentId,
        );

      if (!parent) {
        throw new NotFoundException(
          "Parent module not found.",
        );
      }
    }

    const module =
      await this.moduleRepository.create({
        name,
        code,
        description: dto.description,
        icon: dto.icon,
        route: dto.route,

        sortOrder: dto.sortOrder,
        isMenu: dto.isMenu,
        isVisible: dto.isVisible,
        isSystem: dto.isSystem,
        status: dto.status,

        parent: parent
          ? {
              connect: {
                id: parent.id,
              },
            }
          : undefined,
      });

    return {
      message:
        "Module created successfully.",
      module,
    };
  }

  async findAll() {
    const modules =
      await this.moduleRepository.findAll();

    return {
      message:
        "Modules fetched successfully.",
      modules,
    };
  }

  async findOne(
    id: number,
  ) {
    const module =
      await this.moduleRepository.findById(
        BigInt(id),
      );

    if (!module) {
      throw new NotFoundException(
        "Module not found.",
      );
    }

    return {
      message:
        "Module fetched successfully.",
      module,
    };
  }

  async update(
    id: number,
    dto: UpdateModuleDto,
  ) {
    const module =
      await this.moduleRepository.findById(
        BigInt(id),
      );

    if (!module) {
      throw new NotFoundException(
        "Module not found.",
      );
    }

    const code = dto.code
      ? dto.code.trim().toUpperCase()
      : undefined;

    const name = dto.name
      ? dto.name.trim()
      : undefined;

    if (
      code &&
      code !== module.code
    ) {
      const exists =
        await this.moduleRepository.findByCode(
          code,
        );

      if (
        exists &&
        exists.id !== BigInt(id)
      ) {
        throw new ConflictException(
          "Module code already exists.",
        );
      }
    }

    if (
      name &&
      name !== module.name
    ) {
      const exists =
        await this.moduleRepository.findByName(
          name,
        );

      if (
        exists &&
        exists.id !== BigInt(id)
      ) {
        throw new ConflictException(
          "Module name already exists.",
        );
      }
    }

    let parent: Module | null = null;

    if (dto.parentId) {
      parent =
        await this.moduleRepository.findByUuid(
          dto.parentId,
        );

      if (!parent) {
        throw new NotFoundException(
          "Parent module not found.",
        );
      }

      if (
        parent.id === BigInt(id)
      ) {
        throw new ConflictException(
          "Module cannot be its own parent.",
        );
      }
    }

    const updatedModule =
      await this.moduleRepository.update(
        BigInt(id),
        {
          name,
          code,
          description:
            dto.description,
          icon: dto.icon,
          route: dto.route,

          sortOrder:
            dto.sortOrder,
          isMenu: dto.isMenu,
          isVisible:
            dto.isVisible,
          isSystem:
            dto.isSystem,
          status: dto.status,

          parent: parent
            ? {
                connect: {
                  id: parent.id,
                },
              }
            : undefined,
        },
      );

    return {
      message:
        "Module updated successfully.",
      module: updatedModule,
    };
  }

  async remove(
    id: number,
  ) {
    const module =
      await this.moduleRepository.findById(
        BigInt(id),
      );

    if (!module) {
      throw new NotFoundException(
        "Module not found.",
      );
    }

    if (module.isSystem) {
      throw new ConflictException(
        "System module cannot be deleted.",
      );
    }

    await this.moduleRepository.softDelete(
      BigInt(id),
    );

    return {
      message:
        "Module deleted successfully.",
    };
  }
}