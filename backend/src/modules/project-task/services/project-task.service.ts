import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ProjectTaskReportType,
  ProjectTaskStatus,
  TaskPriority,
} from "@prisma/client";

import {
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  CreateProjectTaskReportDto,
  RequestProjectTaskCompletionDto,
  ReviewProjectTaskCompletionDto
} from "../dto";

import {
  ProjectTaskCompletionDecision,
} from "../dto/review-project-task-completion.dto";


import {
  ProjectTaskCompletionStatus,
} from "@prisma/client";

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
 * Verify that logged-in employee
 * is an active member of project.
 *
 * Used for PROJECT-scoped manager
 * task access.
 */
private async ensureActiveProjectMembership(
  companyId: bigint,
  projectId: bigint,
  employeeId: bigint,
) {
  const projectMember =
    await this.projectTaskRepository
      .findActiveProjectMemberByEmployeeId(
        companyId,
        projectId,
        employeeId,
      );


  if (
    !projectMember
  ) {
    throw new ForbiddenException(
      "You are not an active member of this project.",
    );
  }


  return projectMember;
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
/*
 * Create task.
 *
 * New tasks always begin in TODO.
 * Status is workflow-controlled and
 * cannot be supplied by planning DTO.
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

        /*
         * Status is never accepted
         * from create DTO.
         */
        status:
          ProjectTaskStatus.TODO,

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
          null,

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
/*
 * List project tasks.
 *
 * PROJECT scoped access:
 * logged-in employee must be an
 * active member of this project.
 */
async findAll(
  companyId:
    | bigint
    | null
    | undefined,

  projectUuid:
    string,

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


  const project =
    await this.getProject(
      resolvedCompanyId,
      projectUuid,
    );


  /*
   * Manager can see tasks only
   * for projects where manager
   * is an active ProjectMember.
   */
  await this.ensureActiveProjectMembership(
    resolvedCompanyId,
    project.id,
    resolvedEmployeeId,
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
 * Create employee task report.
 *
 * Allowed:
 *
 * PROGRESS
 * BLOCKER
 * NOTE
 *
 * COMPLETION report is reserved
 * for completion-request workflow.
 */
async createTaskReport(
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

  dto:
    CreateProjectTaskReportDto,
) {
  const resolvedCompanyId =
    this.ensureCompanyContext(
      companyId,
    );


  const resolvedEmployeeId =
    this.ensureEmployeeContext(
      employeeId,
    );


  /*
   * Employee can manually create
   * only normal execution reports.
   *
   * COMPLETION will be created by
   * dedicated completion workflow.
   */
  if (
    dto.type !==
      ProjectTaskReportType.PROGRESS &&
    dto.type !==
      ProjectTaskReportType.BLOCKER &&
    dto.type !==
      ProjectTaskReportType.NOTE
  ) {
    throw new BadRequestException(
      "Only PROGRESS, BLOCKER or NOTE reports can be created manually.",
    );
  }


  const message =
    dto.message.trim();


  if (!message) {
    throw new BadRequestException(
      "Report message is required.",
    );
  }


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
   * Employee must start the task
   * before posting execution reports.
   *
   * Repository re-checks this status
   * inside transaction as well.
   */
  if (
    projectTask.status !==
    ProjectTaskStatus.IN_PROGRESS
  ) {
    throw new BadRequestException(
      `Task report cannot be added while status is ${projectTask.status}.`,
    );
  }


  const result =
    await this.projectTaskRepository
      .createTaskReport(
        resolvedCompanyId,
        project.id,
        projectTask.id,
        assignedProjectMember.id,
        userId,
        dto.type,
        message,
      );


  /*
   * Task may have been reassigned
   * or deleted between service check
   * and repository transaction.
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
   * Task status may have changed
   * concurrently.
   */
  if (
    result.outcome ===
    "INVALID_STATUS"
  ) {
    throw new BadRequestException(
      `Task report cannot be added while status is ${result.status}.`,
    );
  }


  return {
    message:
      "Task report added successfully.",

    report:
      result.report,
  };
}


  /*
   * Manager / planning update.
   *
   * Employee execution should
   * NOT use this method.
   */
/*
 * Manager / planning update.
 *
 * Employee execution should
 * NOT use this method.
 *
 * Important:
 * task status and completedAt are
 * workflow-controlled and are not
 * modified by normal planning edits.
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


  /*
   * Completion-requested tasks must
   * be handled through review workflow,
   * not generic planning edit.
   */
  if (
    existing.status ===
    ProjectTaskStatus
      .COMPLETION_REQUESTED
  ) {
    throw new ConflictException(
      "This task is awaiting completion review and cannot be edited.",
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

          /*
           * status intentionally absent.
           *
           * Workflow methods are the only
           * allowed status transition path.
           */

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

          /*
           * completedAt intentionally absent.
           *
           * It is controlled by completion
           * approval workflow.
           */
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

  async requestCompletion(
  companyId: bigint | null,
  projectUuid: string,
  taskUuid: string,
  userId: bigint,
  employeeId: bigint | null,
  dto: RequestProjectTaskCompletionDto,
) {
  if (
    !companyId ||
    !employeeId
  ) {
    throw new BadRequestException(
      "Employee context is required.",
    );
  }


  const message =
    dto.message?.trim();


  if (
    !message
  ) {
    throw new BadRequestException(
      "Completion message is required.",
    );
  }


  try {
    const result =
      await this.projectTaskRepository
        .requestCompletion(
          companyId,
          projectUuid,
          taskUuid,
          userId,
          employeeId,
          message,
        );


    return {
      message:
        "Completion request submitted successfully.",

      task:
        result.task,

      completionRequest:
        result.completionRequest,
    };
  } catch (
    error
  ) {
    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "TASK_NOT_AVAILABLE"
      ) {
        throw new NotFoundException(
          "Task is not available or is not assigned to you.",
        );
      }


      if (
        error.message ===
        "INVALID_STATUS"
      ) {
        throw new BadRequestException(
          "Only an in-progress task can be submitted for completion.",
        );
      }


      if (
        error.message ===
        "WORK_SESSION_OPEN"
      ) {
        throw new ConflictException(
          "Stop the active work session before requesting completion.",
        );
      }


      if (
        error.message ===
        "COMPLETION_ALREADY_REQUESTED"
      ) {
        throw new ConflictException(
          "A completion request is already pending for this task.",
        );
      }
    }


    throw error;
  }
}


async reviewCompletion(
  companyId:
    bigint | null,

  projectUuid:
    string,

  taskUuid:
    string,

  reviewerUserId:
    bigint,

  reviewerEmployeeId:
    bigint | null,

  dto:
    ReviewProjectTaskCompletionDto,
) {
  const resolvedCompanyId =
    this.ensureCompanyContext(
      companyId,
    );


  const resolvedEmployeeId =
    this.ensureEmployeeContext(
      reviewerEmployeeId,
    );


  /*
   * First resolve the project
   * inside company boundary.
   */
  const project =
    await this.getProject(
      resolvedCompanyId,
      projectUuid,
    );


  /*
   * Completion review is PROJECT
   * scoped.
   *
   * Reviewer must be active member
   * of this project.
   */
  await this.ensureActiveProjectMembership(
    resolvedCompanyId,
    project.id,
    resolvedEmployeeId,
  );


  const reviewNote =
    dto.reviewNote?.trim() ||
    undefined;


  /*
   * Reject requires reason.
   */
  if (
    dto.decision ===
      ProjectTaskCompletionDecision
        .REJECTED &&
    !reviewNote
  ) {
    throw new BadRequestException(
      "Review note is required when rejecting a completion request.",
    );
  }


  const decision =
    dto.decision ===
    ProjectTaskCompletionDecision
      .APPROVED
      ? ProjectTaskCompletionStatus
          .APPROVED
      : ProjectTaskCompletionStatus
          .REJECTED;


  try {
    const result =
      await this.projectTaskRepository
        .reviewCompletion(
          resolvedCompanyId,
          projectUuid,
          taskUuid,
          reviewerUserId,
          decision,
          reviewNote,
        );


    return {
      message:
        decision ===
        ProjectTaskCompletionStatus
          .APPROVED
          ? "Task completion approved successfully."
          : "Task completion rejected successfully.",

      task:
        result.task,

      completionRequest:
        result.completionRequest,
    };
  } catch (
    error
  ) {
    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "TASK_NOT_AVAILABLE"
      ) {
        throw new NotFoundException(
          "Task not found.",
        );
      }


      if (
        error.message ===
        "INVALID_TASK_STATUS"
      ) {
        throw new ConflictException(
          "This task is not awaiting completion review.",
        );
      }


      if (
        error.message ===
        "PENDING_COMPLETION_REQUEST_NOT_FOUND"
      ) {
        throw new ConflictException(
          "No pending completion request was found for this task.",
        );
      }


      if (
        error.message ===
        "INVALID_DECISION"
      ) {
        throw new BadRequestException(
          "Invalid completion review decision.",
        );
      }
    }


    throw error;
  }
}


}