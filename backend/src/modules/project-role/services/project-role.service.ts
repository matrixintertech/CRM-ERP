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

import {
  CompanyBoundaryService,
} from "../../authorization/services/company-boundary.service";

interface AuthUser {
  id: bigint;
}

@Injectable()
export class ProjectRoleService {
  constructor(
    private readonly projectRoleRepository:
      ProjectRoleRepository,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

private async resolveRequiredRole(
  companyId: bigint,
  requiredRoleUuid?: string | null,
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

  private async findRoleOrThrow(
    companyId: bigint,
    uuid: string,
  ) {
    const projectRole =
      await this.projectRoleRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!projectRole) {
      throw new NotFoundException(
        "Project role not found.",
      );
    }

    return projectRole;
  }

  private async ensureNoCircularDependency(
    companyId: bigint,
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
          companyId,
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
    user: AuthUser,
    dto: CreateProjectRoleDto,
  ) {
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        user.id,
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
        companyId,
        name,
      );

    if (existingName) {
      throw new ConflictException(
        "Project role name already exists.",
      );
    }

    const existingCode =
      await this.projectRoleRepository.findByCode(
        companyId,
        code,
      );

    if (existingCode) {
      throw new ConflictException(
        "Project role code already exists.",
      );
    }

    const requiredRole =
      await this.resolveRequiredRole(
        companyId,
        dto.requiredRoleUuid,
      );

    const projectRole =
      await this.projectRoleRepository.create({
        company: {
          connect: {
            id:
              companyId,
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
          dto.sortOrder ??
          0,

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
    user: AuthUser,
  ) {
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        user.id,
      );

    const projectRoles =
      await this.projectRoleRepository.findAll(
        companyId,
      );

    return {
      message:
        "Project roles fetched successfully.",

      projectRoles,
    };
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        user.id,
      );

    return this.findRoleOrThrow(
      companyId,
      uuid,
    );
  }

  async updateByUuid(
    user: AuthUser,
    uuid: string,
    dto: UpdateProjectRoleDto,
  ) {
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        user.id,
      );

    const projectRole =
      await this.findRoleOrThrow(
        companyId,
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
      name !== undefined &&
      name !==
        projectRole.name
    ) {
      const duplicate =
        await this.projectRoleRepository.findByName(
          companyId,
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
      code !== undefined &&
      code !==
        projectRole.code
    ) {
      const duplicate =
        await this.projectRoleRepository.findByCode(
          companyId,
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
          companyId,
          dto.requiredRoleUuid,
        );

      if (requiredRole) {
        await this.ensureNoCircularDependency(
          companyId,
          projectRole.id,
          requiredRole.id,
        );
      }
    }

    const updated =
      await this.projectRoleRepository.update(
        companyId,
        uuid,
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

    if (!updated) {
      throw new NotFoundException(
        "Project role not found.",
      );
    }

    return {
      message:
        "Project role updated successfully.",

      projectRole:
        updated,
    };
  }

  async deleteByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        user.id,
      );

    const projectRole =
      await this.findRoleOrThrow(
        companyId,
        uuid,
      );

    const memberCount =
      await this.projectRoleRepository.countActiveMembers(
        companyId,
        projectRole.id,
      );

    if (memberCount > 0) {
      throw new ConflictException(
        "Project role cannot be deleted because active project members are assigned.",
      );
    }

    const dependentRoleCount =
      await this.projectRoleRepository.countDependentRoles(
        companyId,
        projectRole.id,
      );

    if (
      dependentRoleCount > 0
    ) {
      throw new ConflictException(
        "Project role cannot be deleted because other project roles depend on it.",
      );
    }

    const deleted =
      await this.projectRoleRepository.softDelete(
        companyId,
        uuid,
      );

    if (!deleted) {
      throw new NotFoundException(
        "Project role not found.",
      );
    }

    return {
      message:
        "Project role deleted successfully.",
    };
  }
}