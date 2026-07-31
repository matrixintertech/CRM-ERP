import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Status } from "@prisma/client";

import { CreateDesignationDto } from "../dto/create-designation.dto";
import { UpdateDesignationDto } from "../dto/update-designation.dto";
import { DesignationRepository } from "../repositories/designation.repository";

@Injectable()
export class DesignationService {
  constructor(
    private readonly designationRepository: DesignationRepository,
  ) {}

  async create(
    companyId: number,
    dto: CreateDesignationDto,
  ) {
    const existingName =
      await this.designationRepository.findByName(
        companyId,
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
        description: dto.description,
        status: Status.ACTIVE,
        company: {
          connect: {
            id: BigInt(companyId),
          },
        },
      });

    return {
      message: "Designation created successfully.",
      designation,
    };
  }

  async findAll(companyId: number) {
    const designations =
      await this.designationRepository.findAll(
        companyId,
      );

    return {
      message: "Designations fetched successfully.",
      designations,
    };
  }

  async findOne(
    companyId: number,
    id: number,
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
      message: "Designation fetched successfully.",
      designation,
    };
  }

  async update(
    companyId: number,
    id: number,
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

    if (
      dto.name &&
      dto.name !== designation.name
    ) {
      const existingName =
        await this.designationRepository.findByName(
          companyId,
          dto.name,
        );

      if (existingName) {
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
          dto.code,
        );

      if (existingCode) {
        throw new ConflictException(
          "Designation code already exists.",
        );
      }
    }

    const updatedDesignation =
      await this.designationRepository.update(
        id,
        dto,
      );

    return {
      message: "Designation updated successfully.",
      designation: updatedDesignation,
    };
  }

  async delete(
    companyId: number,
    id: number,
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
      message: "Designation deleted successfully.",
    };
  }
}