import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ProjectTaskStatus,
  TaskPriority,
} from "@prisma/client";

import {
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
} from "../dto";

import {
  ProjectTaskRepository,
} from "../repositories/project-task.repository";

@Injectable()
export class ProjectTaskService {
  constructor(
    private readonly projectTaskRepository:
      ProjectTaskRepository,
  ) {}

  private ensureCompanyContext(
    companyId?: bigint | null,
  ): bigint {
    if (!companyId) {
      throw new BadRequestException(
        "Project tasks can only be managed within a company context.",
      );
    }

    return companyId;
  }

  private async getProject(
    companyId: bigint,
    projectUuid: string,
  ) {
    const project =
      await this.projectTaskRepository.findProjectByUuid(
        companyId,
        projectUuid,
      );

    if (!project) {
      throw new NotFoundException(
        "Project not found.",
      );
    }

    return project;
  }

  private async getAssignedProjectMember(
    companyId: bigint,
    projectId: bigint,
    memberUuid?: string | null,
  ) {
    if (!memberUuid) {
      return null;
    }

    const projectMember =
      await this.projectTaskRepository.findActiveProjectMemberByUuid(
        companyId,
        projectId,
        memberUuid,
      );

    if (!projectMember) {
      throw new BadRequestException(
        "Assigned member must be an active member of this project.",
      );
    }

    return projectMember;
  }

  private validateDates(
    startDate?: string,
    dueDate?: string,
  ) {
    if (
      !startDate ||
      !dueDate
    ) {
      return;
    }

    const start =
      new Date(startDate);

    const due =
      new Date(dueDate);

    if (due < start) {
      throw new BadRequestException(
        "Due date cannot be earlier than start date.",
      );
    }
  }

  async create(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    dto: CreateProjectTaskDto,
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

    this.validateDates(
      dto.startDate,
      dto.dueDate,
    );

    const assignedProjectMember =
      await this.getAssignedProjectMember(
        resolvedCompanyId,
        project.id,
        dto.assignedProjectMemberUuid,
      );

    const status =
      dto.status ??
      ProjectTaskStatus.TODO;

    const projectTask =
      await this.projectTaskRepository.create({
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

        ...(assignedProjectMember && {
          assignedProjectMember: {
            connect: {
              id:
                assignedProjectMember.id,
            },
          },
        }),

        title:
          dto.title.trim(),

        description:
          dto.description?.trim() ||
          null,

        priority:
          dto.priority ??
          TaskPriority.MEDIUM,

        status,

        startDate:
          dto.startDate
            ? new Date(
                dto.startDate,
              )
            : null,

        dueDate:
          dto.dueDate
            ? new Date(
                dto.dueDate,
              )
            : null,

        completedAt:
          status ===
          ProjectTaskStatus.COMPLETED
            ? new Date()
            : null,

        remarks:
          dto.remarks?.trim() ||
          null,

        sortOrder:
          dto.sortOrder ??
          0,
      });

    return {
      message:
        "Project task created successfully.",

      projectTask,
    };
  }

  async findAll(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
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

    const projectTasks =
      await this.projectTaskRepository.findAllByProject(
        resolvedCompanyId,
        project.id,
      );

    return {
      message:
        "Project tasks fetched successfully.",

      projectTasks,
    };
  }

  async findByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    taskUuid: string,
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

    const projectTask =
      await this.projectTaskRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        taskUuid,
      );

    if (!projectTask) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }

    return projectTask;
  }

  async updateByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    taskUuid: string,
    dto: UpdateProjectTaskDto,
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
      await this.projectTaskRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        taskUuid,
      );

    if (!existing) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }

    const nextStartDate =
      dto.startDate !== undefined
        ? dto.startDate
        : existing.startDate
          ? existing.startDate.toISOString()
          : undefined;

    const nextDueDate =
      dto.dueDate !== undefined
        ? dto.dueDate
        : existing.dueDate
          ? existing.dueDate.toISOString()
          : undefined;

    this.validateDates(
      nextStartDate,
      nextDueDate,
    );

    let assignedProjectMember:
      | Awaited<
          ReturnType<
            typeof this.getAssignedProjectMember
          >
        >
      | undefined;

    if (
      dto.assignedProjectMemberUuid !==
      undefined
    ) {
      assignedProjectMember =
        await this.getAssignedProjectMember(
          resolvedCompanyId,
          project.id,
          dto.assignedProjectMemberUuid,
        );
    }

    const nextStatus =
      dto.status ??
      existing.status;

    const updated =
      await this.projectTaskRepository.update(
        existing.id,
        {
          ...(dto.title !==
            undefined && {
            title:
              dto.title.trim(),
          }),

          ...(dto.description !==
            undefined && {
            description:
              dto.description?.trim() ||
              null,
          }),

          ...(dto.priority !==
            undefined && {
            priority:
              dto.priority,
          }),

          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),

          ...(dto.startDate !==
            undefined && {
            startDate:
              dto.startDate
                ? new Date(
                    dto.startDate,
                  )
                : null,
          }),

          ...(dto.dueDate !==
            undefined && {
            dueDate:
              dto.dueDate
                ? new Date(
                    dto.dueDate,
                  )
                : null,
          }),

          ...(dto.remarks !==
            undefined && {
            remarks:
              dto.remarks?.trim() ||
              null,
          }),

          ...(dto.sortOrder !==
            undefined && {
            sortOrder:
              dto.sortOrder,
          }),

          ...(dto.assignedProjectMemberUuid !==
            undefined && {
            assignedProjectMember:
              assignedProjectMember
                ? {
                    connect: {
                      id:
                        assignedProjectMember.id,
                    },
                  }
                : {
                    disconnect:
                      true,
                  },
          }),

          completedAt:
            nextStatus ===
            ProjectTaskStatus.COMPLETED
              ? existing.completedAt ??
                new Date()
              : null,
        },
      );

    return {
      message:
        "Project task updated successfully.",

      projectTask:
        updated,
    };
  }

  async deleteByUuid(
    companyId:
      | bigint
      | null
      | undefined,
    projectUuid: string,
    taskUuid: string,
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

    const projectTask =
      await this.projectTaskRepository.findByUuid(
        resolvedCompanyId,
        project.id,
        taskUuid,
      );

    if (!projectTask) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }

    await this.projectTaskRepository.softDelete(
      projectTask.id,
    );

    return {
      message:
        "Project task deleted successfully.",
    };
  }
}