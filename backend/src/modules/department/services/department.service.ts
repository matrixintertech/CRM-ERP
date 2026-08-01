import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateDepartmentDto } from "../dto/create-department.dto";
import { UpdateDepartmentDto } from "../dto/update-department.dto";

import { OrganizationUnitRepository } from "../../organization-unit/repositories/organization-unit.repository";
import { DepartmentRepository } from "../repositories/department.repository";

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository:
      DepartmentRepository,

    private readonly organizationUnitRepository:
      OrganizationUnitRepository,
  ) {}

  async create(
    companyId: bigint,
    dto: CreateDepartmentDto,
  ) {
    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        dto.organizationUnitUuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization Unit not found.",
      );
    }

    const normalizedName =
      dto.name.trim();

    const normalizedCode =
      dto.code
        .trim()
        .toUpperCase();

    const existingName =
      await this.departmentRepository.findByName(
        companyId,
        organizationUnit.id,
        normalizedName,
      );

    if (existingName) {
      throw new ConflictException(
        "Department name already exists.",
      );
    }

    const existingCode =
      await this.departmentRepository.findByCode(
        companyId,
        organizationUnit.id,
        normalizedCode,
      );

    if (existingCode) {
      throw new ConflictException(
        "Department code already exists.",
      );
    }

    return this.departmentRepository.create(
      companyId,
      organizationUnit.id,
      {
        ...dto,
        name: normalizedName,
        code: normalizedCode,
      },
    );
  }

  async findAll(
    companyId: bigint,
  ) {
    return this.departmentRepository.findAll(
      companyId,
    );
  }

  async findOne(
    companyId: bigint,
    id: bigint,
  ) {
    const department =
      await this.departmentRepository.findById(
        companyId,
        id,
      );

    if (!department) {
      throw new NotFoundException(
        "Department not found.",
      );
    }

    return department;
  }

  async update(
    companyId: bigint,
    id: bigint,
    dto: UpdateDepartmentDto,
  ) {
    const department =
      await this.findOne(
        companyId,
        id,
      );

    let organizationUnitId =
      department.organizationUnitId;

    if (dto.organizationUnitUuid) {
      const organizationUnit =
        await this.organizationUnitRepository.findByUuid(
          companyId,
          dto.organizationUnitUuid,
        );

      if (!organizationUnit) {
        throw new NotFoundException(
          "Organization Unit not found.",
        );
      }

      organizationUnitId =
        organizationUnit.id;
    }

    const normalizedName =
      dto.name?.trim();

    const normalizedCode =
      dto.code
        ?.trim()
        .toUpperCase();

    if (normalizedName) {
      const existingName =
        await this.departmentRepository.findByName(
          companyId,
          organizationUnitId,
          normalizedName,
        );

      if (
        existingName &&
        existingName.id !== id
      ) {
        throw new ConflictException(
          "Department name already exists.",
        );
      }
    }

    if (normalizedCode) {
      const existingCode =
        await this.departmentRepository.findByCode(
          companyId,
          organizationUnitId,
          normalizedCode,
        );

      if (
        existingCode &&
        existingCode.id !== id
      ) {
        throw new ConflictException(
          "Department code already exists.",
        );
      }
    }

    return this.departmentRepository.update(
  companyId,
  id,
  {
    ...(normalizedName !== undefined && {
      name: normalizedName,
    }),

    ...(normalizedCode !== undefined && {
      code: normalizedCode,
    }),

    ...(dto.description !== undefined && {
      description: dto.description,
    }),

    ...(dto.organizationUnitUuid && {
      organizationUnit: {
        connect: {
          id: organizationUnitId,
        },
      },
    }),
  },
);
  }

  async delete(
    companyId: bigint,
    id: bigint,
  ) {
    await this.findOne(
      companyId,
      id,
    );

    return this.departmentRepository.softDelete(
  companyId,
  id,
);
  }

  async findByUuid(
  companyId: bigint,
  uuid: string,
) {
  const department =
    await this.departmentRepository.findByUuid(
      companyId,
      uuid,
    );

  if (!department) {
    throw new NotFoundException(
      "Department not found.",
    );
  }

  return department;
}

async updateByUuid(
  companyId: bigint,
  uuid: string,
  dto: UpdateDepartmentDto,
) {
  const department =
    await this.findByUuid(
      companyId,
      uuid,
    );

  return this.update(
    companyId,
    department.id,
    dto,
  );
}

async deleteByUuid(
  companyId: bigint,
  uuid: string,
) {
  const department =
    await this.findByUuid(
      companyId,
      uuid,
    );

  return this.delete(
    companyId,
    department.id,
  );
}
}