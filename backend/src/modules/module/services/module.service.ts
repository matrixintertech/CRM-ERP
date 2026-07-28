import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ModuleRepository } from '../repositories/module.repository';

import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async create(
    dto: CreateModuleDto,
  ) {
    const codeExists =
      await this.moduleRepository.findByCode(
        dto.code,
      );

    if (codeExists) {
      throw new ConflictException(
        'Module code already exists.',
      );
    }

    const nameExists =
      await this.moduleRepository.findByName(
        dto.name,
      );

    if (nameExists) {
      throw new ConflictException(
        'Module name already exists.',
      );
    }

    const module =
      await this.moduleRepository.create({
        ...dto,
      });

    return {
      message:
        'Module created successfully.',
      module,
    };
  }

  async findAll() {
    const modules =
      await this.moduleRepository.findAll();

    return {
      message:
        'Modules fetched successfully.',
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
        'Module not found.',
      );
    }

    return {
      message:
        'Module fetched successfully.',
      module,
    };
  }

  async update(
    id: number,
    dto: UpdateModuleDto,
  ) {
    await this.findOne(id);

    if (dto.code) {
      const exists =
        await this.moduleRepository.findByCode(
          dto.code,
        );

      if (
        exists &&
        exists.id !== BigInt(id)
      ) {
        throw new ConflictException(
          'Module code already exists.',
        );
      }
    }

    if (dto.name) {
      const exists =
        await this.moduleRepository.findByName(
          dto.name,
        );

      if (
        exists &&
        exists.id !== BigInt(id)
      ) {
        throw new ConflictException(
          'Module name already exists.',
        );
      }
    }

    const module =
      await this.moduleRepository.update(
        BigInt(id),
        dto,
      );

    return {
      message:
        'Module updated successfully.',
      module,
    };
  }

  async remove(
    id: number,
  ) {
    await this.findOne(id);

    await this.moduleRepository.softDelete(
      BigInt(id),
    );

    return {
      message:
        'Module deleted successfully.',
    };
  }
}