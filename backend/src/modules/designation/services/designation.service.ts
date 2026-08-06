import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Status } from '@prisma/client';

import { CreateDesignationDto } from '../dto/create-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation.dto';

import { DesignationRepository } from '../repositories/designation.repository';
import { DepartmentRepository } from '../../department/repositories/department.repository';

@Injectable()
export class DesignationService {
  constructor(
    private readonly designationRepository: DesignationRepository,

    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async create(companyId: bigint, dto: CreateDesignationDto) {
    const department = await this.departmentRepository.findByUuid(
      companyId,
      dto.departmentUuid,
    );

    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    const normalizedName = dto.name.trim();

    const normalizedCode = dto.code.trim().toUpperCase();

    const existingName = await this.designationRepository.findByName(
      companyId,
      department.id,
      normalizedName,
    );

    if (existingName) {
      throw new ConflictException('Designation name already exists.');
    }

    const existingCode = await this.designationRepository.findByCode(
      companyId,
      department.id,
      normalizedCode,
    );

    if (existingCode) {
      throw new ConflictException('Designation code already exists.');
    }

    const designation = await this.designationRepository.create({
      name: normalizedName,

      code: normalizedCode,

      description: dto.description,

      status: Status.ACTIVE,

      company: {
        connect: {
          id: companyId,
        },
      },

      department: {
        connect: {
          id: department.id,
        },
      },
    });

    return {
      message: 'Designation created successfully.',

      designation,
    };
  }

  async findAll(companyId?: bigint) {
    const designations = await this.designationRepository.findAll(companyId);

    return {
      message: 'Designations fetched successfully.',

      designations,
    };
  }

  async findOne(companyId: bigint, id: bigint) {
    const designation = await this.designationRepository.findById(
      companyId,
      id,
    );

    if (!designation) {
      throw new NotFoundException('Designation not found.');
    }

    return {
      message: 'Designation fetched successfully.',

      designation,
    };
  }

  async update(companyId: bigint, id: bigint, dto: UpdateDesignationDto) {
    const designation = await this.designationRepository.findById(
      companyId,
      id,
    );

    if (!designation) {
      throw new NotFoundException('Designation not found.');
    }

    let departmentId = designation.departmentId;

    if (dto.departmentUuid) {
      const department = await this.departmentRepository.findByUuid(
        companyId,
        dto.departmentUuid,
      );

      if (!department) {
        throw new NotFoundException('Department not found.');
      }

      departmentId = department.id;
    }

    const normalizedName = dto.name?.trim();

    const normalizedCode = dto.code?.trim().toUpperCase();

    if (normalizedName && normalizedName !== designation.name) {
      const existingName = await this.designationRepository.findByName(
        companyId,
        departmentId,
        normalizedName,
      );

      if (existingName && existingName.id !== id) {
        throw new ConflictException('Designation name already exists.');
      }
    }

    if (normalizedCode && normalizedCode !== designation.code) {
      const existingCode = await this.designationRepository.findByCode(
        companyId,
        departmentId,
        normalizedCode,
      );

      if (existingCode && existingCode.id !== id) {
        throw new ConflictException('Designation code already exists.');
      }
    }

    const updatedDesignation = await this.designationRepository.update(id, {
      ...(normalizedName !== undefined && {
        name: normalizedName,
      }),

      ...(normalizedCode !== undefined && {
        code: normalizedCode,
      }),

      ...(dto.description !== undefined && {
        description: dto.description,
      }),

      ...(dto.departmentUuid && {
        department: {
          connect: {
            id: departmentId,
          },
        },
      }),
    });

    return {
      message: 'Designation updated successfully.',

      designation: updatedDesignation,
    };
  }

  async delete(companyId: bigint, id: bigint) {
    const designation = await this.designationRepository.findById(
      companyId,
      id,
    );

    if (!designation) {
      throw new NotFoundException('Designation not found.');
    }

    await this.designationRepository.softDelete(id);

    return {
      message: 'Designation deleted successfully.',
    };
  }

  async findByUuid(companyId: bigint, uuid: string) {
    const designation = await this.designationRepository.findByUuid(
      companyId,
      uuid,
    );

    if (!designation) {
      throw new NotFoundException('Designation not found.');
    }

    return designation;
  }

  async updateByUuid(
    companyId: bigint,
    uuid: string,
    dto: UpdateDesignationDto,
  ) {
    const designation = await this.findByUuid(companyId, uuid);

    return this.update(companyId, designation.id, dto);
  }

  async deleteByUuid(companyId: bigint, uuid: string) {
    const designation = await this.findByUuid(companyId, uuid);

    return this.delete(companyId, designation.id);
  }
}
