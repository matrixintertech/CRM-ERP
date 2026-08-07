import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  AssignProjectMemberDto,
  UpdateProjectMemberDto,
} from "../dto";

import {
  ProjectMemberRepository,
} from "../repositories/project-member.repository";

@Injectable()
export class ProjectMemberService {
  constructor(
    private readonly projectMemberRepository:
      ProjectMemberRepository,
  ) {}

  private ensureCompanyContext(
    companyId?: bigint | null,
  ): bigint {
    if (!companyId) {
      throw new BadRequestException(
        "Project members can only be managed within a company context.",
      );
    }

    return companyId;
  }

  private async getProject(
    companyId: bigint,
    projectUuid: string,
  ) {
    const project =
      await this.projectMemberRepository.findProjectByUuid(
        companyId,
        projectUuid,
      );

    if (!project) {
      throw new NotFoundException(
        "Project not found or inactive.",
      );
    }

    return project;
  }

  private async getEmployee(
    companyId: bigint,
    employeeUuid: string,
  ) {
    const employee =
      await this.projectMemberRepository.findEmployeeByUuid(
        companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found or inactive.",
      );
    }

    return employee;
  }

  private async getProjectRole(
    companyId: bigint,
    projectRoleUuid: string,
  ) {
    const projectRole =
      await this.projectMemberRepository.findProjectRoleByUuid(
        companyId,
        projectRoleUuid,
      );

    if (!projectRole) {
      throw new NotFoundException(
        "Project role not found or inactive.",
      );
    }

    return projectRole;
  }

  private async validateRoleDependency(
    projectId: bigint,
    projectRole: {
      name: string;
      requiredRoleId: bigint | null;
      requiredRole?: {
        name: string;
      } | null;
    },
  ) {
    if (!projectRole.requiredRoleId) {
      return;
    }

    const requiredAssignment =
      await this.projectMemberRepository.findActiveRequiredRoleAssignment(
        projectId,
        projectRole.requiredRoleId,
      );

    if (!requiredAssignment) {
      throw new BadRequestException(
        `${
          projectRole.requiredRole?.name ??
          "Required project role"
        } must be assigned before assigning ${projectRole.name}.`,
      );
    }
  }

  async assign(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    dto: AssignProjectMemberDto,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const project =
      await this.getProject(
        resolvedCompanyId,
        projectUuid,
      );

    const employee =
      await this.getEmployee(
        resolvedCompanyId,
        dto.employeeUuid,
      );

    const projectRole =
      await this.getProjectRole(
        resolvedCompanyId,
        dto.projectRoleUuid,
      );

    await this.validateRoleDependency(
      project.id,
      projectRole,
    );

    const duplicate =
      await this.projectMemberRepository.findActiveByProjectEmployeeRole(
        project.id,
        employee.id,
        projectRole.id,
      );

    if (duplicate) {
      throw new ConflictException(
        "Employee is already assigned to this project role.",
      );
    }

    /*
     * Single-assignee roles:
     *
     * Project Manager / Service Manager etc.
     *
     * Existing active assignment ko deactivate
     * karke naya assignment create karte hain.
     * Isse assignment history preserve rahegi.
     */
    if (
      projectRole.isSingleAssignee
    ) {
      await this.projectMemberRepository.deactivateByProjectAndRole(
        project.id,
        projectRole.id,
      );
    }

    const projectMember =
      await this.projectMemberRepository.create({
        company: {
          connect: {
            id:
              resolvedCompanyId,
          },
        },

        project: {
          connect: {
            id:
              project.id,
          },
        },

        employee: {
          connect: {
            id:
              employee.id,
          },
        },

        projectRole: {
          connect: {
            id:
              projectRole.id,
          },
        },

        assignedAt:
          new Date(),

        isActive:
          true,

        remarks:
          dto.remarks?.trim() ||
          null,
      });

    return {
      message:
        "Project member assigned successfully.",

      projectMember,
    };
  }

  async findAll(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    includeHistory = false,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const project =
      await this.getProject(
        resolvedCompanyId,
        projectUuid,
      );

    const projectMembers =
      await this.projectMemberRepository.findAllByProject(
        resolvedCompanyId,
        project.id,
        !includeHistory,
      );

    return {
      message:
        "Project members fetched successfully.",

      projectMembers,
    };
  }

  async findByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    memberUuid: string,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const project =
      await this.getProject(
        resolvedCompanyId,
        projectUuid,
      );

    const projectMember =
      await this.projectMemberRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        memberUuid,
      );

    if (!projectMember) {
      throw new NotFoundException(
        "Project member assignment not found.",
      );
    }

    return projectMember;
  }

  async updateByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    memberUuid: string,
    dto: UpdateProjectMemberDto,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const project =
      await this.getProject(
        resolvedCompanyId,
        projectUuid,
      );

    const existing =
      await this.projectMemberRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        memberUuid,
      );

    if (!existing) {
      throw new NotFoundException(
        "Project member assignment not found.",
      );
    }

    if (!existing.isActive) {
      throw new BadRequestException(
        "Inactive project member assignment cannot be updated.",
      );
    }

    const employee =
      dto.employeeUuid
        ? await this.getEmployee(
            resolvedCompanyId,
            dto.employeeUuid,
          )
        : existing.employee;

    const projectRole =
      dto.projectRoleUuid
        ? await this.getProjectRole(
            resolvedCompanyId,
            dto.projectRoleUuid,
          )
        : existing.projectRole;

    await this.validateRoleDependency(
      project.id,
      projectRole,
    );

    const duplicate =
      await this.projectMemberRepository.findActiveByProjectEmployeeRole(
        project.id,
        employee.id,
        projectRole.id,
      );

    if (
      duplicate &&
      duplicate.id !== existing.id
    ) {
      throw new ConflictException(
        "Employee is already assigned to this project role.",
      );
    }

    /*
     * Agar update ke through role single-assignee
     * ban raha hai, doosre active assignee ko remove karo.
     */
    if (
      projectRole.isSingleAssignee
    ) {
      const currentAssignee =
        await this.projectMemberRepository.findActiveByProjectAndRole(
          project.id,
          projectRole.id,
        );

      if (
        currentAssignee &&
        currentAssignee.id !==
          existing.id
      ) {
        await this.projectMemberRepository.deactivate(
          currentAssignee.id,
        );
      }
    }

    const updated =
      await this.projectMemberRepository.update(
        existing.id,
        {
          ...(employee.id !==
            existing.employeeId && {
            employee: {
              connect: {
                id:
                  employee.id,
              },
            },
          }),

          ...(projectRole.id !==
            existing.projectRoleId && {
            projectRole: {
              connect: {
                id:
                  projectRole.id,
              },
            },
          }),

          ...(dto.remarks !==
            undefined && {
            remarks:
              dto.remarks?.trim() ||
              null,
          }),
        },
      );

    return {
      message:
        "Project member assignment updated successfully.",

      projectMember:
        updated,
    };
  }

  async removeByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    memberUuid: string,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );

    const project =
      await this.getProject(
        resolvedCompanyId,
        projectUuid,
      );

    const projectMember =
      await this.projectMemberRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        memberUuid,
      );

    if (!projectMember) {
      throw new NotFoundException(
        "Project member assignment not found.",
      );
    }

    if (!projectMember.isActive) {
      throw new BadRequestException(
        "Project member assignment is already inactive.",
      );
    }

    /*
     * Important dependency protection:
     *
     * Example:
     * Service Manager requires Project Manager.
     *
     * Agar Service Manager active hai to
     * Project Manager ko remove nahi kar sakte.
     */
    const dependentAssignments =
      await this.projectMemberRepository
        .findActiveAssignmentsDependingOnRole(
          project.id,
          projectMember.projectRoleId,
        );

    if (
      dependentAssignments.length >
      0
    ) {
      const dependentRoleNames =
        [
          ...new Set(
            dependentAssignments.map(
              (assignment) =>
                assignment.projectRole.name,
            ),
          ),
        ].join(", ");

      throw new ConflictException(
        `This assignment cannot be removed because the following active project roles depend on it: ${dependentRoleNames}.`,
      );
    }

    await this.projectMemberRepository.deactivate(
      projectMember.id,
    );

    return {
      message:
        "Project member removed successfully.",
    };
  }
}