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

  private async resolveRequiredRole(
    companyId: bigint,
    requiredRoleUuid?: string,
  ) {
    if (!requiredRoleUuid) {
      return null;
    }

    const requiredRole =
      await this.projectRoleRepository.findRequiredRoleByUuid(
        companyId,
        requiredRoleUuid,
      );

    if (!requiredRole) {
      throw new BadRequestException(
        "Required project role not found or inactive.",
      );
    }

    return requiredRole;
  }

  private async ensureNoCircularDependency(
    projectRoleId: bigint,
    requiredRoleId: bigint,
  ) {
    if (
      projectRoleId ===
      requiredRoleId
    ) {
      throw new BadRequestException(
        "A project role cannot require itself.",
      );
    }

    let currentRoleId:
      | bigint
      | null =
      requiredRoleId;

    const visited =
      new Set<string>();

    while (currentRoleId) {
      if (
        currentRoleId ===
        projectRoleId
      ) {
        throw new BadRequestException(
          "Circular project role dependency is not allowed.",
        );
      }

      const key =
        currentRoleId.toString();

      if (visited.has(key)) {
        throw new BadRequestException(
          "Circular project role dependency is not allowed.",
        );
      }

      visited.add(key);

      const role =
        await this.projectRoleRepository.findById(
          currentRoleId,
        );

      if (!role) {
        break;
      }

      currentRoleId =
        role.requiredRoleId;
    }
  }

  async create(
    companyId:
      | bigint
      | null
      | undefined,
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
        .replace(
          /\s+/g,
          "_",
        );

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

    const requiredRole =
      await this.resolveRequiredRole(
        resolvedCompanyId,
        dto.requiredRoleUuid,
      );

    const projectRole =
      await this.projectRoleRepository.create({
        company: {
          connect: {
            id:
              resolvedCompanyId,
          },
        },

        ...(requiredRole && {
          requiredRole: {
            connect: {
              id:
                requiredRole.id,
            },
          },
        }),

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
    companyId?:
      | bigint
      | null,
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
    companyId:
      | bigint
      | null
      | undefined,
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
    companyId:
      | bigint
      | null
      | undefined,
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
            .replace(
              /\s+/g,
              "_",
            )
        : undefined;

    if (
      name &&
      name !==
        projectRole.name
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
      code !==
        projectRole.code
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

    let requiredRole:
      | Awaited<
          ReturnType<
            typeof this.resolveRequiredRole
          >
        >
      | undefined;

    if (
      dto.requiredRoleUuid !==
      undefined
    ) {
      requiredRole =
        await this.resolveRequiredRole(
          resolvedCompanyId,
          dto.requiredRoleUuid,
        );

      if (requiredRole) {
        await this.ensureNoCircularDependency(
          projectRole.id,
          requiredRole.id,
        );
      }
    }

    const updated =
      await this.projectRoleRepository.update(
        projectRole.id,
        {
          ...(name !==
            undefined && {
            name,
          }),

          ...(code !==
            undefined && {
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

          ...(dto.requiredRoleUuid !==
            undefined && {
            requiredRole:
              requiredRole
                ? {
                    connect: {
                      id:
                        requiredRole.id,
                    },
                  }
                : {
                    disconnect:
                      true,
                  },
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
    companyId:
      | bigint
      | null
      | undefined,
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

    const dependentRoleCount =
      await this.projectRoleRepository.countDependentRoles(
        projectRole.id,
      );

    if (
      dependentRoleCount > 0
    ) {
      throw new ConflictException(
        "Project role cannot be deleted because other project roles depend on it.",
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