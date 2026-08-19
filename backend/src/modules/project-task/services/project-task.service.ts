import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  PermissionScope,
  ProjectTaskAttachmentType,
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

import {
  EffectivePermissionService,
} from "../../authorization/services/effective-permission.service";

import {
  ProjectTaskReportAttachmentService,
} from "./project-task-report-attachment.service";


@Injectable()
export class ProjectTaskService {
  constructor(
    private readonly projectTaskRepository:
      ProjectTaskRepository,

      private readonly effectivePermissionService:
    EffectivePermissionService,

     private readonly projectTaskReportAttachmentService:
    ProjectTaskReportAttachmentService,
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


  /*
   * Project must always belong to
   * current company.
   */
  const project =
    await this.getProject(
      resolvedCompanyId,
      projectUuid,
    );


  /*
   * Resolve effective authorization.
   *
   * Do NOT authorize based on UserType.
   */
  const authorization =
    await this.effectivePermissionService
      .getAuthorization(
        userId,
      );


  /*
   * Defensive tenant boundary check.
   */
  if (
    !authorization.user.companyId ||
    authorization.user.companyId !==
      resolvedCompanyId
  ) {
    throw new ForbiddenException(
      "Project task access is not allowed outside your company.",
    );
  }


  /*
   * Same permission may come from
   * role + direct user grants with
   * different scopes.
   */
  const scopes =
    Array.from(
      new Set(
        authorization
          .companyPermissions
          .filter(
            (permission) =>
              permission.code ===
              "company.task.view",
          )
          .map(
            (permission) =>
              permission.scope,
          ),
      ),
    );


  if (
    scopes.length ===
    0
  ) {
    throw new ForbiddenException(
      "You do not have permission to view project tasks.",
    );
  }


  /*
   * =========================================================
   * COMPANY SCOPE
   * =========================================================
   *
   * Company Admin normally reaches
   * this branch through its RolePermission.
   *
   * No employee context required.
   * No ProjectMember requirement.
   *
   * Project itself is already hard-filtered
   * by current company above.
   */
  if (
    scopes.includes(
      PermissionScope.COMPANY,
    )
  ) {
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
   * =========================================================
   * PROJECT SCOPE
   * =========================================================
   *
   * Project-scoped manager must be
   * an active member of this project.
   */
  if (
    scopes.includes(
      PermissionScope.PROJECT,
    )
  ) {
    const resolvedEmployeeId =
      this.ensureEmployeeContext(
        employeeId,
      );


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
   * OWN / TEAM / ORGANIZATION_UNIT
   *
   * Project workspace list ke liye
   * dedicated filtered behavior abhi
   * implement nahi hai.
   *
   * Broad access dene ke bajay fail closed.
   */
  throw new ForbiddenException(
    "Your permission scope does not allow viewing all tasks for this project.",
  );
}


/*
 * =========================================================
 * PROJECT TASK REPORT ATTACHMENT VIEW URL
 * =========================================================
 *
 * Project workspace:
 *
 * Manager / Company Admin / authorized
 * task viewer ke liye private evidence
 * attachment ka temporary signed GET URL.
 *
 * Authorization:
 *
 * COMPANY
 *   -> same company boundary enough
 *
 * PROJECT
 *   -> active project membership required
 *
 * OWN / TEAM / ORGANIZATION_UNIT
 *   -> project-wide workspace access
 *      currently implemented nahi hai,
 *      therefore fail closed.
 *
 * Important:
 * Employee My Tasks attachment endpoint
 * se separate authorization path hai.
 */
async getReportAttachmentViewUrl(
  companyId:
    | bigint
    | null
    | undefined,

  projectUuid:
    string,

  taskUuid:
    string,

  attachmentUuid:
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


  /*
   * Project must belong to current
   * company boundary.
   */
  const project =
    await this.getProject(
      resolvedCompanyId,
      projectUuid,
    );


  /*
   * Resolve fresh effective permissions.
   *
   * Do not authorize based on UserType.
   */
  const authorization =
    await this.effectivePermissionService
      .getAuthorization(
        userId,
      );


  /*
   * Defensive tenant boundary.
   */
  if (
    !authorization.user.companyId ||
    authorization.user.companyId !==
      resolvedCompanyId
  ) {
    throw new ForbiddenException(
      "Project task attachment access is not allowed outside your company.",
    );
  }


  /*
   * Same permission can be granted
   * multiple times with different scopes.
   */
  const scopes =
    Array.from(
      new Set(
        authorization
          .companyPermissions
          .filter(
            (
              permission,
            ) =>
              permission.code ===
              "company.task.view",
          )
          .map(
            (
              permission,
            ) =>
              permission.scope,
          ),
      ),
    );


  if (
    scopes.length ===
    0
  ) {
    throw new ForbiddenException(
      "You do not have permission to view project task attachments.",
    );
  }


  /*
   * =========================================================
   * COMPANY SCOPE
   * =========================================================
   *
   * Company Admin normally reaches here
   * through RolePermission.
   *
   * No employee context or project
   * membership required.
   */
  if (
    scopes.includes(
      PermissionScope.COMPANY,
    )
  ) {
    const projectTask =
      await this.projectTaskRepository
        .findByUuid(
          resolvedCompanyId,
          project.id,
          taskUuid,
        );


    if (
      !projectTask
    ) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }


    return this
      .projectTaskReportAttachmentService
      .getProjectAttachmentViewUrl(
        resolvedCompanyId,
        taskUuid,
        attachmentUuid,
      );
  }


  /*
   * =========================================================
   * PROJECT SCOPE
   * =========================================================
   *
   * Project manager must be active
   * member of the requested project.
   */
  if (
    scopes.includes(
      PermissionScope.PROJECT,
    )
  ) {
    const resolvedEmployeeId =
      this.ensureEmployeeContext(
        employeeId,
      );


    await this.ensureActiveProjectMembership(
      resolvedCompanyId,
      project.id,
      resolvedEmployeeId,
    );


    /*
     * Ensure requested task belongs
     * to the same company + project.
     */
    const projectTask =
      await this.projectTaskRepository
        .findByUuid(
          resolvedCompanyId,
          project.id,
          taskUuid,
        );


    if (
      !projectTask
    ) {
      throw new NotFoundException(
        "Project task not found.",
      );
    }


    return this
      .projectTaskReportAttachmentService
      .getProjectAttachmentViewUrl(
        resolvedCompanyId,
        taskUuid,
        attachmentUuid,
      );
  }


  /*
   * OWN / TEAM / ORGANIZATION_UNIT
   *
   * Project workspace visibility rules
   * are not implemented for these scopes.
   *
   * Never widen access implicitly.
   */
  throw new ForbiddenException(
    "Your permission scope does not allow viewing attachments for all tasks in this project.",
  );
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
   * Same task already has
   * an OPEN work session.
   */
  if (
    result.outcome ===
    "ALREADY_OPEN"
  ) {
    throw new ConflictException(
      "Work is already in progress for this task.",
    );
  }


  /*
   * =========================================================
   * ANOTHER TASK ALREADY ACTIVE
   * =========================================================
   *
   * Business rule:
   *
   * One employee/user can have
   * maximum one OPEN work session
   * across all projects/tasks.
   *
   * User must stop the current
   * active task before starting
   * another task.
   */
  if (
    result.outcome ===
    "ANOTHER_TASK_ACTIVE"
  ) {
    const activeTaskTitle =
      result.activeTask
        ?.title?.trim();


    if (
      activeTaskTitle
    ) {
      throw new ConflictException(
        `You are already working on "${activeTaskTitle}". Stop the active task before starting another task.`,
      );
    }


    throw new ConflictException(
      "Another task is already active. Stop the current work session before starting another task.",
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
   */
  if (
    projectTask.status !==
    ProjectTaskStatus.IN_PROGRESS
  ) {
    throw new BadRequestException(
      `Task report cannot be added while status is ${projectTask.status}.`,
    );
  }


  /*
   * =========================================================
   * ATTACHMENT VALIDATION
   * =========================================================
   */
  const requestedAttachments =
    dto.attachments ??
    [];


  /*
   * DTO already limits this to five,
   * but service also fails closed.
   */
  if (
    requestedAttachments.length >
    5
  ) {
    throw new BadRequestException(
      "A maximum of 5 images can be attached to a task report.",
    );
  }


  /*
   * Same storage key must not appear
   * twice in a single request.
   */
  const storageKeys =
    requestedAttachments.map(
      (attachment) =>
        attachment.storageKey.trim(),
    );


  if (
    new Set(
      storageKeys,
    ).size !==
    storageKeys.length
  ) {
    throw new BadRequestException(
      "Duplicate task report attachments are not allowed.",
    );
  }


  /*
   * R2/S3 verification:
   *
   * - object belongs to this task
   * - object exists
   * - MIME type matches
   * - actual size matches
   * - <= 5 MB
   * - object is not already attached
   */
  const verifiedAttachments =
    await Promise.all(
      requestedAttachments.map(
        async (
          attachment,
        ) => {
          const verified =
            await this
              .projectTaskReportAttachmentService
              .verifyImageUpload(
                resolvedCompanyId,
                taskUuid,
                resolvedEmployeeId,
                {
                  storageKey:
                    attachment.storageKey,

                  contentType:
                    attachment.contentType,

                  fileSize:
                    attachment.fileSize,
                },
              );


          return {
            type:
              ProjectTaskAttachmentType.IMAGE,

            originalName:
              attachment.originalName
                .trim(),

            mimeType:
              verified.contentType,

            sizeBytes:
              BigInt(
                verified.sizeBytes,
              ),

            storageKey:
              verified.storageKey,
          };
        },
      ),
    );


  /*
   * Report + attachments should be
   * created atomically by repository.
   */
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
        verifiedAttachments,
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