import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateDepartmentDto,
} from '../dto/create-department.dto';

import {
  UpdateDepartmentDto,
} from '../dto/update-department.dto';

import {
  OrganizationUnitRepository,
} from '../../organization-unit/repositories/organization-unit.repository';

import {
  DepartmentRepository,
  DepartmentAccessBoundary,
} from '../repositories/department.repository';

import {
  DepartmentPolicy,
} from '../../authorization/policies/department.policy';

interface AuthUser {
  id: bigint;
}

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository:
      DepartmentRepository,

    private readonly organizationUnitRepository:
      OrganizationUnitRepository,

    private readonly departmentPolicy:
      DepartmentPolicy,
  ) {}

  private assertOrganizationUnitAccess(
    access: DepartmentAccessBoundary,
    organizationUnitId: bigint,
  ) {
    /*
     * null = COMPANY scope.
     * Company ke kisi bhi OU ko access.
     */
    if (
      access.organizationUnitIds ===
      null
    ) {
      return;
    }

    const hasAccess =
      access.organizationUnitIds.some(
        (id) =>
          id ===
          organizationUnitId,
      );

    if (!hasAccess) {
      /*
       * Resource existence leak nahi karna.
       */
      throw new NotFoundException(
        'Organization Unit not found.',
      );
    }
  }

  private async findByIdOrThrow(
    access: DepartmentAccessBoundary,
    id: bigint,
  ) {
    const department =
      await this.departmentRepository.findById(
        access,
        id,
      );

    if (!department) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return department;
  }

  private async findByUuidOrThrow(
    access: DepartmentAccessBoundary,
    uuid: string,
  ) {
    const department =
      await this.departmentRepository.findByUuid(
        access,
        uuid,
      );

    if (!department) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return department;
  }

  async create(
    user: AuthUser,
    dto: CreateDepartmentDto,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.create',
      );

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        access.companyId,
        dto.organizationUnitUuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        'Organization Unit not found.',
      );
    }

    /*
     * ORGANIZATION_UNIT scope hua to target
     * OU authorized list me hona chahiye.
     *
     * COMPANY hua to automatically pass.
     */
    this.assertOrganizationUnitAccess(
      access,
      organizationUnit.id,
    );

    const normalizedName =
      dto.name.trim();

    const normalizedCode =
      dto.code
        .trim()
        .toUpperCase();

    const existingName =
      await this.departmentRepository.findByName(
        access.companyId,
        organizationUnit.id,
        normalizedName,
      );

    if (existingName) {
      throw new ConflictException(
        'Department name already exists.',
      );
    }

    const existingCode =
      await this.departmentRepository.findByCode(
        access.companyId,
        organizationUnit.id,
        normalizedCode,
      );

    if (existingCode) {
      throw new ConflictException(
        'Department code already exists.',
      );
    }

    return this.departmentRepository.create(
      access.companyId,
      organizationUnit.id,
      {
        ...dto,

        name:
          normalizedName,

        code:
          normalizedCode,

        description:
          dto.description
            ?.trim(),
      },
    );
  }

  async findAll(
    user: AuthUser,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.view',
      );

    return this.departmentRepository.findAll(
      access,
    );
  }

  async findOne(
    user: AuthUser,
    id: bigint,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.view',
      );

    return this.findByIdOrThrow(
      access,
      id,
    );
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.view',
      );

    return this.findByUuidOrThrow(
      access,
      uuid,
    );
  }

  async update(
    user: AuthUser,
    id: bigint,
    dto: UpdateDepartmentDto,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.update',
      );

    const department =
      await this.findByIdOrThrow(
        access,
        id,
      );

    let organizationUnitId =
      department.organizationUnitId;

    if (
      dto.organizationUnitUuid !==
      undefined
    ) {
      const organizationUnit =
        await this.organizationUnitRepository.findByUuid(
          access.companyId,
          dto.organizationUnitUuid,
        );

      if (!organizationUnit) {
        throw new NotFoundException(
          'Organization Unit not found.',
        );
      }

      /*
       * User department ko kisi unauthorized
       * OU me move nahi kar sakta.
       */
      this.assertOrganizationUnitAccess(
        access,
        organizationUnit.id,
      );

      organizationUnitId =
        organizationUnit.id;
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
        await this.departmentRepository.findByName(
          access.companyId,
          organizationUnitId,
          normalizedName,
        );

      if (
        existingName &&
        existingName.id !==
          department.id
      ) {
        throw new ConflictException(
          'Department name already exists.',
        );
      }
    }

    if (
      normalizedCode !==
      undefined
    ) {
      const existingCode =
        await this.departmentRepository.findByCode(
          access.companyId,
          organizationUnitId,
          normalizedCode,
        );

      if (
        existingCode &&
        existingCode.id !==
          department.id
      ) {
        throw new ConflictException(
          'Department code already exists.',
        );
      }
    }

    const updated =
      await this.departmentRepository.update(
        access,
        department.id,
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

          ...(dto.organizationUnitUuid !==
            undefined && {
            organizationUnit: {
              connect: {
                id:
                  organizationUnitId,
              },
            },
          }),
        },
      );

    if (!updated) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return updated;
  }

  async updateByUuid(
    user: AuthUser,
    uuid: string,
    dto: UpdateDepartmentDto,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.update',
      );

    const department =
      await this.findByUuidOrThrow(
        access,
        uuid,
      );

    return this.updateWithAccess(
      access,
      department.id,
      dto,
    );
  }

  private async updateWithAccess(
    access: DepartmentAccessBoundary,
    id: bigint,
    dto: UpdateDepartmentDto,
  ) {
    const department =
      await this.findByIdOrThrow(
        access,
        id,
      );

    let organizationUnitId =
      department.organizationUnitId;

    if (
      dto.organizationUnitUuid !==
      undefined
    ) {
      const organizationUnit =
        await this.organizationUnitRepository.findByUuid(
          access.companyId,
          dto.organizationUnitUuid,
        );

      if (!organizationUnit) {
        throw new NotFoundException(
          'Organization Unit not found.',
        );
      }

      this.assertOrganizationUnitAccess(
        access,
        organizationUnit.id,
      );

      organizationUnitId =
        organizationUnit.id;
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
        await this.departmentRepository.findByName(
          access.companyId,
          organizationUnitId,
          normalizedName,
        );

      if (
        existingName &&
        existingName.id !==
          department.id
      ) {
        throw new ConflictException(
          'Department name already exists.',
        );
      }
    }

    if (
      normalizedCode !==
      undefined
    ) {
      const existingCode =
        await this.departmentRepository.findByCode(
          access.companyId,
          organizationUnitId,
          normalizedCode,
        );

      if (
        existingCode &&
        existingCode.id !==
          department.id
      ) {
        throw new ConflictException(
          'Department code already exists.',
        );
      }
    }

    const updated =
      await this.departmentRepository.update(
        access,
        department.id,
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

          ...(dto.organizationUnitUuid !==
            undefined && {
            organizationUnit: {
              connect: {
                id:
                  organizationUnitId,
              },
            },
          }),
        },
      );

    if (!updated) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return updated;
  }

  async delete(
    user: AuthUser,
    id: bigint,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.delete',
      );

    const department =
      await this.findByIdOrThrow(
        access,
        id,
      );

    const deleted =
      await this.departmentRepository.softDelete(
        access,
        department.id,
      );

    if (!deleted) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return deleted;
  }

  async deleteByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const access =
      await this.departmentPolicy.resolveAccess(
        user.id,
        'company.department.delete',
      );

    const department =
      await this.findByUuidOrThrow(
        access,
        uuid,
      );

    const deleted =
      await this.departmentRepository.softDelete(
        access,
        department.id,
      );

    if (!deleted) {
      throw new NotFoundException(
        'Department not found.',
      );
    }

    return deleted;
  }
}