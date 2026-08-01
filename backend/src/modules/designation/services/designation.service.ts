import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Status,
} from "@prisma/client";

import { CreateDesignationDto } from "../dto/create-designation.dto";
import { UpdateDesignationDto } from "../dto/update-designation.dto";

import { DesignationRepository } from "../repositories/designation.repository";
import { DepartmentRepository } from "../../department/repositories/department.repository";

@Injectable()
export class DesignationService {
  constructor(
    private readonly designationRepository:
      DesignationRepository,

    private readonly departmentRepository:
      DepartmentRepository,
  ) {}

  async create(
    companyId: bigint,
    dto: CreateDesignationDto,
  ) {
    const department =
      await this.departmentRepository.findByUuid(
        companyId,
        dto.departmentId,
      );

    if (!department) {
      throw new NotFoundException(
        "Department not found.",
      );
    }

    const existingName =
      await this.designationRepository.findByName(
        companyId,
        department.id,
        dto.name,
      );

    if (existingName) {
      throw new ConflictException(
        "Designation name already exists.",
      );
    }

    const existingCode =
      await this.designationRepository.findByCode(
        companyId,
        department.id,
        dto.code,
      );

    if (existingCode) {
      throw new ConflictException(
        "Designation code already exists.",
      );
    }

    const designation =
      await this.designationRepository.create({
        name: dto.name,
        code: dto.code,
        description:
          dto.description,

        status:
          Status.ACTIVE,

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
      message:
        "Designation created successfully.",
      designation,
    };
  }


  async findAll(
    companyId: bigint,
  ) {
    const designations =
      await this.designationRepository.findAll(
        companyId,
      );

    return {
      message:
        "Designations fetched successfully.",
      designations,
    };
  }


  async findOne(
    companyId: bigint,
    id: bigint,
  ) {
    const designation =
      await this.designationRepository.findById(
        companyId,
        id,
      );

    if (!designation) {
      throw new NotFoundException(
        "Designation not found.",
      );
    }

    return {
      message:
        "Designation fetched successfully.",
      designation,
    };
  }


  async update(
    companyId: bigint,
    id: bigint,
    dto: UpdateDesignationDto,
  ) {
    const designation =
      await this.designationRepository.findById(
        companyId,
        id,
      );

    if (!designation) {
      throw new NotFoundException(
        "Designation not found.",
      );
    }

    let departmentId =
      designation.departmentId;

    if (dto.departmentId) {
      const department =
        await this.departmentRepository.findByUuid(
          companyId,
          dto.departmentId,
        );

      if (!department) {
        throw new NotFoundException(
          "Department not found.",
        );
      }

      departmentId =
        department.id;
    }


    if (
      dto.name &&
      dto.name !== designation.name
    ) {
      const existingName =
        await this.designationRepository.findByName(
          companyId,
          departmentId,
          dto.name,
        );

      if (
        existingName &&
        existingName.id !== id
      ) {
        throw new ConflictException(
          "Designation name already exists.",
        );
      }
    }


    if (
      dto.code &&
      dto.code !== designation.code
    ) {
      const existingCode =
        await this.designationRepository.findByCode(
          companyId,
          departmentId,
          dto.code,
        );

      if (
        existingCode &&
        existingCode.id !== id
      ) {
        throw new ConflictException(
          "Designation code already exists.",
        );
      }
    }


    const updatedDesignation =
      await this.designationRepository.update(
        id,
        {
          name: dto.name,
          code: dto.code,
          description:
            dto.description,

          department:
            dto.departmentId
              ? {
                  connect: {
                    id: departmentId,
                  },
                }
              : undefined,
        },
      );


    return {
      message:
        "Designation updated successfully.",

      designation:
        updatedDesignation,
    };
  }


  async delete(
    companyId: bigint,
    id: bigint,
  ) {
    const designation =
      await this.designationRepository.findById(
        companyId,
        id,
      );

    if (!designation) {
      throw new NotFoundException(
        "Designation not found.",
      );
    }

    await this.designationRepository.softDelete(
      id,
    );

    return {
      message:
        "Designation deleted successfully.",
    };
  }
}