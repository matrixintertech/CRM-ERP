import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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


  /*
   * Company boundary validation.
   */
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


  /*
   * Employee execution actions
   * require an employee-linked user.
   */
private ensureEmployeeContext(
  employeeId?: bigint | null,
): bigint {
  if (!employeeId) {
    throw new ForbiddenException(
      "Employee context is required for this action.",
    );
  }

  return employeeId;
}


  /*
   * Resolve project within
   * current company boundary.
   */
  private async getProject(
    companyId: bigint,
    projectUuid: string,
  ) {
    const project =
      await this.projectTaskRepository
        .findProjectByUuid(
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


  /*
   * Resolve active project member
   * during task assignment.
   */
  private async getAssignedProjectMember(
    companyId: bigint,
    projectId: bigint,
    memberUuid?: string | null,
  ) {
    if (!memberUuid) {
      return null;
    }

    const projectMember =
      await this.projectTaskRepository
        .findActiveProjectMemberByUuid(
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


  /*
   * Resolve task execution context.
   *
   * Employee execution is allowed
   * only when:
   *
   * - task exists
   * - task has an assignee
   * - project member is active
   * - assigned employee is the
   *   currently logged-in employee
   */
  private async getExecutionContext(
    companyId: bigint,
    projectUuid: string,
    taskUuid: string,
    employeeId: bigint,
  ) {
    const project =
      await this.getProject(
        companyId,
        projectUuid,
      );


    const projectTask =
      await this.projectTaskRepository
        .findByUuid(
          companyId,
          project.id,
          taskUuid,
        );


    if (!projectTask) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }


    const assignedProjectMember =
      projectTask
        .assignedProjectMember;


    if (!assignedProjectMember) {
      throw new ForbiddenException(
        "This task is not assigned to you.",
      );
    }


    if (
      !assignedProjectMember.isActive
    ) {
      throw new ForbiddenException(
        "Your project membership is not active.",
      );
    }


    if (
      assignedProjectMember.employeeId !==
      employeeId
    ) {
      throw new ForbiddenException(
        "This task is assigned to another employee.",
      );
    }


    return {
      project,
      projectTask,
      assignedProjectMember,
    };
  }


  /*
   * Validate planning dates.
   */
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
      new Date(
        startDate,
      );


    const due =
      new Date(
        dueDate,
      );


    if (
      due <
      start
    ) {
      throw new BadRequestException(
        "Due date cannot be earlier than start date.",
      );
    }
  }


  /*
   * Create task.
   */
  async create(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    dto:
      CreateProjectTaskDto,
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
      await this.projectTaskRepository
        .create({
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
            dto.description
              ?.trim() ||
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
            dto.remarks
              ?.trim() ||
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


  /*
   * List project tasks.
   */
  async findAll(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,
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
      await this.projectTaskRepository
        .findAllByProject(
          resolvedCompanyId,
          project.id,
        );


    return {
      message:
        "Project tasks fetched successfully.",

      projectTasks,
    };
  }


  /*
 * Logged-in employee ke
 * assigned tasks across projects.
 *
 * Ownership:
 *
 * ProjectTask
 *   -> assignedProjectMember
 *   -> employeeId
 */
async findMyTasks(
  companyId:
    | bigint
    | null
    | undefined,

  employeeId:
    | bigint
    | null
    | undefined,
) {
  const resolvedCompanyId =
    this.ensureCompanyContext(
      companyId,
    );


  const resolvedEmployeeId =
    this.ensureEmployeeContext(
      employeeId,
    );


  const projectTasks =
    await this.projectTaskRepository
      .findMyTasks(
        resolvedCompanyId,
        resolvedEmployeeId,
      );


  return {
    message:
      "My tasks fetched successfully.",

    projectTasks,
  };
}


  /*
   * Task details.
   */
  async findByUuid(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    taskUuid:
      string,
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
      await this.projectTaskRepository
        .findByUuid(
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


  /*
   * Start Work
   *
   * Employee execution action.
   *
   * First work session:
   *
   * TODO
   *   ->
   * IN_PROGRESS
   *
   * Later work sessions can start
   * while task is already IN_PROGRESS.
   */
  async startWork(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    taskUuid:
      string,

    userId:
      bigint,

    employeeId:
      | bigint
      | null
      | undefined,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );


    const resolvedEmployeeId =
      this.ensureEmployeeContext(
        employeeId,
      );


    const {
      project,
      projectTask,
      assignedProjectMember,
    } =
      await this.getExecutionContext(
        resolvedCompanyId,
        projectUuid,
        taskUuid,
        resolvedEmployeeId,
      );


    /*
     * Friendly service-level
     * validation.
     *
     * Repository checks this again
     * inside transaction.
     */
    if (
      projectTask.status !==
        ProjectTaskStatus.TODO &&
      projectTask.status !==
        ProjectTaskStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        `Task cannot be started while status is ${projectTask.status}.`,
      );
    }


    const result =
      await this.projectTaskRepository
        .startWork(
          resolvedCompanyId,
          project.id,
          projectTask.id,
          assignedProjectMember.id,
          userId,
        );


    /*
     * Task was reassigned/deleted
     * between service validation and
     * repository transaction.
     */
    if (
      result.outcome ===
      "TASK_NOT_AVAILABLE"
    ) {
      throw new ConflictException(
        "Task assignment changed. Refresh the task and try again.",
      );
    }


    /*
     * Repository performs another
     * status check inside transaction.
     */
    if (
      result.outcome ===
      "INVALID_STATUS"
    ) {
      throw new BadRequestException(
        `Task cannot be started while status is ${result.status}.`,
      );
    }


    /*
     * Prevent duplicate OPEN sessions.
     */
    if (
      result.outcome ===
      "ALREADY_OPEN"
    ) {
      throw new ConflictException(
        "Work is already in progress for this task.",
      );
    }


    return {
      message:
        "Work started successfully.",

      projectTask:
        result.projectTask,

      workSession:
        result.workSession,
    };
  }


  /*
   * Stop Work
   *
   * Closes employee's OPEN
   * work session.
   *
   * Task status remains
   * IN_PROGRESS.
   */
  async stopWork(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    taskUuid:
      string,

    userId:
      bigint,

    employeeId:
      | bigint
      | null
      | undefined,
  ) {
    const resolvedCompanyId =
      this.ensureCompanyContext(
        companyId,
      );


    const resolvedEmployeeId =
      this.ensureEmployeeContext(
        employeeId,
      );


    const {
      projectTask,
      assignedProjectMember,
    } =
      await this.getExecutionContext(
        resolvedCompanyId,
        projectUuid,
        taskUuid,
        resolvedEmployeeId,
      );


    /*
     * Do NOT require IN_PROGRESS here.
     *
     * If task status was changed by
     * manager while employee still had
     * an OPEN session, employee should
     * still be able to safely close it.
     */
    const result =
      await this.projectTaskRepository
        .stopWork(
          resolvedCompanyId,
          projectTask.id,
          assignedProjectMember.id,
          userId,
        );


    if (
      result.outcome ===
      "NO_OPEN_SESSION"
    ) {
      throw new BadRequestException(
        "No active work session found for this task.",
      );
    }


    return {
      message:
        "Work stopped successfully.",

      workSession:
        result.workSession,
    };
  }


  /*
   * Manager / planning update.
   *
   * Employee execution should
   * NOT use this method.
   */
  async updateByUuid(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    taskUuid:
      string,

    dto:
      UpdateProjectTaskDto,
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
      await this.projectTaskRepository
        .findByUuid(
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
      dto.startDate !==
      undefined
        ? dto.startDate
        : existing.startDate
          ? existing.startDate
              .toISOString()
          : undefined;


    const nextDueDate =
      dto.dueDate !==
      undefined
        ? dto.dueDate
        : existing.dueDate
          ? existing.dueDate
              .toISOString()
          : undefined;


    this.validateDates(
      nextStartDate,
      nextDueDate,
    );


    let assignedProjectMember:
      | Awaited<
          ReturnType<
            typeof this
              .getAssignedProjectMember
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
      await this.projectTaskRepository
        .update(
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
                dto.description
                  ?.trim() ||
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
                dto.remarks
                  ?.trim() ||
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


  /*
   * Soft delete / cancel.
   */
  async deleteByUuid(
    companyId:
      | bigint
      | null
      | undefined,

    projectUuid:
      string,

    taskUuid:
      string,
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
      await this.projectTaskRepository
        .findByUuid(
          resolvedCompanyId,
          project.id,
          taskUuid,
        );


    if (!projectTask) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }


    await this.projectTaskRepository
      .softDelete(
        projectTask.id,
      );


    return {
      message:
        "Project task deleted successfully.",
    };
  }
}