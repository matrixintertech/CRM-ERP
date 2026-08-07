import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Status,
} from "@prisma/client";

import {
  CreateProjectRoleDto,
  UpdateProjectRoleDto,
} from "../dto";

import {
  ProjectRoleRepository,
} from "../repositories/project-role.repository";

@Injectable()
export class ProjectRoleService {
  constructor(
    private readonly projectRoleRepository:
      ProjectRoleRepository,
  ) {}

  private ensureCompanyContext(
    companyId?: bigint | null,
  ): bigint {
    if (!companyId) {
      throw new BadRequestException(
        "Project Roles can only be managed within a company context.",
      );
    }

    return companyId;
  }

  async create(
    companyId: bigint | null | undefined,
    dto: CreateProjectRoleDto,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const name =
      dto.name.trim();

    const code =
      dto.code
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

    const existingName =
      await this.projectRoleRepository.findByName(
        resolvedCompanyId,
        name,
      );

    if (existingName) {
      throw new ConflictException(
        "Project role name already exists.",
      );
    }

    const existingCode =
      await this.projectRoleRepository.findByCode(
        resolvedCompanyId,
        code,
      );

    if (existingCode) {
      throw new ConflictException(
        "Project role code already exists.",
      );
    }

    const projectRole =
      await this.projectRoleRepository.create({
        company: {
          connect: {
            id: resolvedCompanyId,
          },
        },

        name,
        code,

        description:
          dto.description?.trim() ||
          null,

        isSingleAssignee:
          dto.isSingleAssignee ??
          false,

        sortOrder:
          dto.sortOrder ?? 0,

        status:
          Status.ACTIVE,
      });

    return {
      message:
        "Project role created successfully.",

      projectRole,
    };
  }

  async findAll(
    companyId?: bigint | null,
  ) {
    const projectRoles =
      await this.projectRoleRepository.findAll(
        companyId ??
          undefined,
      );

    return {
      message:
        "Project roles fetched successfully.",

      projectRoles,
    };
  }

  async findByUuid(
    companyId: bigint | null | undefined,
    uuid: string,
  ) {
    const projectRole =
      await this.projectRoleRepository.findByUuid(
        companyId ??
          undefined,
        uuid,
      );

    if (!projectRole) {
      throw new NotFoundException(
        "Project role not found.",
      );
    }

    return projectRole;
  }

  async updateByUuid(
    companyId: bigint | null | undefined,
    uuid: string,
    dto: UpdateProjectRoleDto,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const projectRole =
      await this.findByUuid(
        resolvedCompanyId,
        uuid,
      );

    const name =
      dto.name !== undefined
        ? dto.name.trim()
        : undefined;

    const code =
      dto.code !== undefined
        ? dto.code
            .trim()
            .toUpperCase()
            .replace(/\s+/g, "_")
        : undefined;

    if (
      name &&
      name !== projectRole.name
    ) {
      const duplicate =
        await this.projectRoleRepository.findByName(
          resolvedCompanyId,
          name,
        );

      if (
        duplicate &&
        duplicate.id !==
          projectRole.id
      ) {
        throw new ConflictException(
          "Project role name already exists.",
        );
      }
    }

    if (
      code &&
      code !== projectRole.code
    ) {
      const duplicate =
        await this.projectRoleRepository.findByCode(
          resolvedCompanyId,
          code,
        );

      if (
        duplicate &&
        duplicate.id !==
          projectRole.id
      ) {
        throw new ConflictException(
          "Project role code already exists.",
        );
      }
    }

    const updated =
      await this.projectRoleRepository.update(
        projectRole.id,
        {
          ...(name !== undefined && {
            name,
          }),

          ...(code !== undefined && {
            code,
          }),

          ...(dto.description !==
            undefined && {
            description:
              dto.description?.trim() ||
              null,
          }),

          ...(dto.isSingleAssignee !==
            undefined && {
            isSingleAssignee:
              dto.isSingleAssignee,
          }),

          ...(dto.sortOrder !==
            undefined && {
            sortOrder:
              dto.sortOrder,
          }),

          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),
        },
      );

    return {
      message:
        "Project role updated successfully.",

      projectRole:
        updated,
    };
  }

  async deleteByUuid(
    companyId: bigint | null | undefined,
    uuid: string,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const projectRole =
      await this.findByUuid(
        resolvedCompanyId,
        uuid,
      );

    const memberCount =
      await this.projectRoleRepository.countActiveMembers(
        projectRole.id,
      );

    if (memberCount > 0) {
      throw new ConflictException(
        "Project role cannot be deleted because active project members are assigned.",
      );
    }

    await this.projectRoleRepository.softDelete(
      projectRole.id,
    );

    return {
      message:
        "Project role deleted successfully.",
    };
  }
}