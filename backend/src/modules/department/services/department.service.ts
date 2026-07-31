import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateDepartmentDto } from "../dto/create-department.dto";
import { UpdateDepartmentDto } from "../dto/update-department.dto";
import { DepartmentRepository } from "../repositories/department.repository";

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async create(companyId: number, dto: CreateDepartmentDto) {
    const existingName = await this.departmentRepository.findByName(
      companyId,
      dto.name,
    );

    if (existingName) {
      throw new ConflictException("Department name already exists.");
    }

    const existingCode = await this.departmentRepository.findByCode(
      companyId,
      dto.code,
    );

    if (existingCode) {
      throw new ConflictException("Department code already exists.");
    }

    return this.departmentRepository.create(companyId, dto);
  }

  async findAll(companyId: number) {
    return this.departmentRepository.findAll(companyId);
  }

  async findOne(companyId: number, id: number) {
    const department = await this.departmentRepository.findById(
      companyId,
      id,
    );

    if (!department) {
      throw new NotFoundException("Department not found.");
    }

    return department;
  }

  async update(
    companyId: number,
    id: number,
    dto: UpdateDepartmentDto,
  ) {
    await this.findOne(companyId, id);

    if (dto.name) {
      const existingName =
        await this.departmentRepository.findByName(
          companyId,
          dto.name,
        );

      if (existingName && Number(existingName.id) !== id) {
        throw new ConflictException(
          "Department name already exists.",
        );
      }
    }

    if (dto.code) {
      const existingCode =
        await this.departmentRepository.findByCode(
          companyId,
          dto.code,
        );

      if (existingCode && Number(existingCode.id) !== id) {
        throw new ConflictException(
          "Department code already exists.",
        );
      }
    }

    return this.departmentRepository.update(id, dto);
  }

  async delete(companyId: number, id: number) {
    await this.findOne(companyId, id);

    return this.departmentRepository.softDelete(id);
  }
}