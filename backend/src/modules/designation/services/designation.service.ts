import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Status,
} from '@prisma/client';

import {
  CreateDesignationDto,
} from '../dto/create-designation.dto';

import {
  UpdateDesignationDto,
} from '../dto/update-designation.dto';

import {
  DesignationRepository,
  DesignationAccessBoundary,
} from '../repositories/designation.repository';

import {
  DepartmentRepository,
} from '../../department/repositories/department.repository';

import {
  DesignationPolicy,
} from '../../authorization/policies/designation.policy';

interface AuthUser {
  id: bigint;
}

@Injectable()
export class DesignationService {
  constructor(
    private readonly designationRepository:
      DesignationRepository,

    private readonly departmentRepository:
      DepartmentRepository,

    private readonly designationPolicy:
      DesignationPolicy,
  ) {}

  /*
   * COMPANY scope:
   * organizationUnitIds = null
   *
   * ORGANIZATION_UNIT scope:
   * department ka organizationUnitId
   * authorized list me hona chahiye.
   */
  private assertDepartmentAccess(
    access: DesignationAccessBoundary,
    organizationUnitId: bigint | null,
  ) {
    if (
      access.organizationUnitIds ===
      null
    ) {
      return;
    }

    if (
      organizationUnitId === null ||
      !access.organizationUnitIds.some(
        (id) =>
          id ===
          organizationUnitId,
      )
    ) {
      /*
       * Unauthorized department ki
       * existence expose nahi karni.
       */
      throw new NotFoundException(
        'Department not found.',
      );
    }
  }

  private async findByIdOrThrow(
    access: DesignationAccessBoundary,
    id: bigint,
  ) {
    const designation =
      await this.designationRepository.findById(
        access,
        id,
      );

    if (!designation) {
      throw new NotFoundException(
        'Designation not found.',
      );
    }

    return designation;
  }

  private async findByUuidOrThrow(
    access: DesignationAccessBoundary,
    uuid: string,
  ) {
    const designation =
      await this.designationRepository.findByUuid(
        access,
        uuid,
      );

    if (!designation) {
      throw new NotFoundException(
        'Designation not found.',
      );
    }

    return designation;
  }

  async create(
    user: AuthUser,
    dto: CreateDesignationDto,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.create',
      );

    /*
     * Same company ka department resolve karo.
     *
     * Authorization separately OU boundary
     * ke against check hogi.
     */
    const department =
      await this.departmentRepository.findByUuidInCompany(
        access.companyId,
        dto.departmentUuid,
      );

    if (!department) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    this.assertDepartmentAccess(
      access,
      department.organizationUnitId,
    );

    const normalizedName =
      dto.name.trim();

    const normalizedCode =
      dto.code
        .trim()
        .toUpperCase();

    const existingName =
      await this.designationRepository.findByName(
        access.companyId,
        department.id,
        normalizedName,
      );

    if (existingName) {
      throw new ConflictException(
        'Designation name already exists.',
      );
    }

    const existingCode =
      await this.designationRepository.findByCode(
        access.companyId,
        department.id,
        normalizedCode,
      );

    if (existingCode) {
      throw new ConflictException(
        'Designation code already exists.',
      );
    }

    const designation =
      await this.designationRepository.create({
        name:
          normalizedName,

        code:
          normalizedCode,

        description:
          dto.description?.trim(),

        status:
          Status.ACTIVE,

        company: {
          connect: {
            id:
              access.companyId,
          },
        },

        department: {
          connect: {
            id:
              department.id,
          },
        },
      });

    return {
      message:
        'Designation created successfully.',

      designation,
    };
  }

  async findAll(
    user: AuthUser,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.view',
      );

    const designations =
      await this.designationRepository.findAll(
        access,
      );

    return {
      message:
        'Designations fetched successfully.',

      designations,
    };
  }

  async findOne(
    user: AuthUser,
    id: bigint,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.view',
      );

    const designation =
      await this.findByIdOrThrow(
        access,
        id,
      );

    return {
      message:
        'Designation fetched successfully.',

      designation,
    };
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.view',
      );

    return this.findByUuidOrThrow(
      access,
      uuid,
    );
  }

  async update(
    user: AuthUser,
    id: bigint,
    dto: UpdateDesignationDto,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.update',
      );

    return this.updateWithAccess(
      access,
      id,
      dto,
    );
  }

  private async updateWithAccess(
    access: DesignationAccessBoundary,
    id: bigint,
    dto: UpdateDesignationDto,
  ) {
    const designation =
      await this.findByIdOrThrow(
        access,
        id,
      );

    let departmentId =
      designation.departmentId;

    if (
      dto.departmentUuid !==
      undefined
    ) {
      const department =
        await this.departmentRepository.findByUuidInCompany(
          access.companyId,
          dto.departmentUuid,
        );

      if (!department) {
        throw new NotFoundException(
          'Department not found.',
        );
      }

      /*
       * ORGANIZATION_UNIT scope user
       * designation ko unauthorized OU ke
       * department me move nahi kar sakta.
       */
      this.assertDepartmentAccess(
        access,
        department.organizationUnitId,
      );

      departmentId =
        department.id;
    }

    const normalizedName =
      dto.name !== undefined
        ? dto.name.trim()
        : undefined;

    const normalizedCode =
      dto.code !== undefined
        ? dto.code
            .trim()
            .toUpperCase()
        : undefined;

    if (
      normalizedName !==
      undefined
    ) {
      const existingName =
        await this.designationRepository.findByName(
          access.companyId,
          departmentId,
          normalizedName,
        );

      if (
        existingName &&
        existingName.id !==
          designation.id
      ) {
        throw new ConflictException(
          'Designation name already exists.',
        );
      }
    }

    if (
      normalizedCode !==
      undefined
    ) {
      const existingCode =
        await this.designationRepository.findByCode(
          access.companyId,
          departmentId,
          normalizedCode,
        );

      if (
        existingCode &&
        existingCode.id !==
          designation.id
      ) {
        throw new ConflictException(
          'Designation code already exists.',
        );
      }
    }

    const updatedDesignation =
      await this.designationRepository.update(
        access,
        designation.id,
        {
          ...(normalizedName !==
            undefined && {
            name:
              normalizedName,
          }),

          ...(normalizedCode !==
            undefined && {
            code:
              normalizedCode,
          }),

          ...(dto.description !==
            undefined && {
            description:
              dto.description
                ?.trim() ||
              null,
          }),

          ...(dto.departmentUuid !==
            undefined && {
            department: {
              connect: {
                id:
                  departmentId,
              },
            },
          }),
        },
      );

    if (!updatedDesignation) {
      throw new NotFoundException(
        'Designation not found.',
      );
    }

    return {
      message:
        'Designation updated successfully.',

      designation:
        updatedDesignation,
    };
  }

  async updateByUuid(
    user: AuthUser,
    uuid: string,
    dto: UpdateDesignationDto,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.update',
      );

    const designation =
      await this.findByUuidOrThrow(
        access,
        uuid,
      );

    return this.updateWithAccess(
      access,
      designation.id,
      dto,
    );
  }

  async delete(
    user: AuthUser,
    id: bigint,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.delete',
      );

    const designation =
      await this.findByIdOrThrow(
        access,
        id,
      );

    const deleted =
      await this.designationRepository.softDelete(
        access,
        designation.id,
      );

    if (!deleted) {
      throw new NotFoundException(
        'Designation not found.',
      );
    }

    return {
      message:
        'Designation deleted successfully.',
    };
  }

  async deleteByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const access =
      await this.designationPolicy.resolveAccess(
        user.id,
        'company.designation.delete',
      );

    const designation =
      await this.findByUuidOrThrow(
        access,
        uuid,
      );

    const deleted =
      await this.designationRepository.softDelete(
        access,
        designation.id,
      );

    if (!deleted) {
      throw new NotFoundException(
        'Designation not found.',
      );
    }

    return {
      message:
        'Designation deleted successfully.',
    };
  }
}