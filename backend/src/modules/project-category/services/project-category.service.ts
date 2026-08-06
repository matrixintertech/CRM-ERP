import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserType, type User } from '@prisma/client';

import { CreateProjectCategoryDto } from '../dto/create-project-category.dto';

import { UpdateProjectCategoryDto } from '../dto/update-project-category.dto';

import { ProjectCategoryRepository } from '../repositories/project-category.repository';

@Injectable()
export class ProjectCategoryService {
  constructor(
    private readonly projectCategoryRepository: ProjectCategoryRepository,
  ) {}

  private getCompanyId(user: User): bigint {
    if (!user.companyId) {
      throw new NotFoundException('Company not found.');
    }

    return user.companyId;
  }

  async create(user: User, dto: CreateProjectCategoryDto) {
    const companyId = this.getCompanyId(user);

    const name = dto.name.trim();

    const code = dto.code.trim().toUpperCase().replace(/\s+/g, '_');

    const existingName = await this.projectCategoryRepository.findByName(
      companyId,
      name,
    );

    if (existingName) {
      throw new ConflictException('Project category name already exists.');
    }

    const existingCode = await this.projectCategoryRepository.findByCode(
      companyId,
      code,
    );

    if (existingCode) {
      throw new ConflictException('Project category code already exists.');
    }

    const category = await this.projectCategoryRepository.create({
      company: {
        connect: {
          id: companyId,
        },
      },

      name,

      code,

      description: dto.description?.trim() || null,

      color: dto.color || null,

      sortOrder: dto.sortOrder ?? 0,
    });

    return {
      message: 'Project category created successfully.',

      category,
    };
  }

  async findAll(user: User) {
    const companyId =
      user.userType === UserType.PLATFORM_OWNER
        ? undefined
        : this.getCompanyId(user);

    const categories = await this.projectCategoryRepository.findAll(companyId);

    return {
      message: 'Project categories fetched successfully.',

      categories,
    };
  }

  async findOne(user: User, uuid: string) {
    const companyId = this.getCompanyId(user);

    const category = await this.projectCategoryRepository.findByUuid(
      companyId,
      uuid,
    );

    if (!category) {
      throw new NotFoundException('Project category not found.');
    }

    return {
      message: 'Project category fetched successfully.',

      category,
    };
  }

  async update(user: User, uuid: string, dto: UpdateProjectCategoryDto) {
    const companyId = this.getCompanyId(user);

    const category = await this.projectCategoryRepository.findByUuid(
      companyId,
      uuid,
    );

    if (!category) {
      throw new NotFoundException('Project category not found.');
    }

    const name = dto.name !== undefined ? dto.name.trim() : undefined;

    const code =
      dto.code !== undefined
        ? dto.code.trim().toUpperCase().replace(/\s+/g, '_')
        : undefined;

    if (name && name !== category.name) {
      const duplicateName = await this.projectCategoryRepository.findByName(
        companyId,
        name,
      );

      if (duplicateName && duplicateName.uuid !== uuid) {
        throw new ConflictException('Project category name already exists.');
      }
    }

    if (code && code !== category.code) {
      const duplicateCode = await this.projectCategoryRepository.findByCode(
        companyId,
        code,
      );

      if (duplicateCode && duplicateCode.uuid !== uuid) {
        throw new ConflictException('Project category code already exists.');
      }
    }

    const updated = await this.projectCategoryRepository.update(
      category.id,

      {
        ...(name !== undefined && {
          name,
        }),

        ...(code !== undefined && {
          code,
        }),

        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),

        ...(dto.color !== undefined && {
          color: dto.color || null,
        }),

        ...(dto.sortOrder !== undefined && {
          sortOrder: dto.sortOrder,
        }),
      },
    );

    return {
      message: 'Project category updated successfully.',

      category: updated,
    };
  }

  async delete(user: User, uuid: string) {
    const companyId = this.getCompanyId(user);

    const category = await this.projectCategoryRepository.findByUuid(
      companyId,
      uuid,
    );

    if (!category) {
      throw new NotFoundException('Project category not found.');
    }

    const projectCount = await this.projectCategoryRepository.countProjects(
      category.id,
    );

    if (projectCount > 0) {
      throw new ConflictException(
        'Project category cannot be deleted because projects are assigned.',
      );
    }

    await this.projectCategoryRepository.softDelete(category.id);

    return {
      message: 'Project category deleted successfully.',
    };
  }
}
