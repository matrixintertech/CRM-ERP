import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  AuthGuard,
} from "@nestjs/passport";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import type {
  Request,
} from "express";

import {
  User,
} from "@prisma/client";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

import {
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  RequestProjectTaskCompletionDto,
  ReviewProjectTaskCompletionDto,
  TaskWorkLocationDto
} from "../dto";

import {
  CreateProjectTaskReportDto,
} from "../dto/create-project-task-report.dto";

import {
  ProjectTaskService,
} from "../services/project-task.service";


interface AuthenticatedRequest
  extends Request {
  user: User;
}


@ApiTags("Project Tasks")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller(
  "projects/:projectUuid/tasks",
)
export class ProjectTaskController {
  constructor(
    private readonly projectTaskService:
      ProjectTaskService,
  ) {}


  /*
   * Manager / authorized user:
   * Create task.
   */
  @Post()
  @RequirePermission(
    "company.task.create",
  )
  @ApiOperation({
    summary:
      "Create project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Body()
    dto:
      CreateProjectTaskDto,
  ) {
    return this.projectTaskService
      .create(
        req.user.companyId,
        projectUuid,
        dto,
      );
  }


  /*
   * View project tasks.
   *
   * PROJECT scoped access:
   * logged-in employee must be
   * active member of project.
   */
  @Get()
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get project tasks",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,
  ) {
    return this.projectTaskService
  .findAll(
    req.user.companyId,
    projectUuid,
    req.user.id,
    req.user.employeeId,
  );
  }


  /*
   * Employee:
   * Start working on assigned task.
   *
   * Service verifies:
   *
   * - employee context exists
   * - task belongs to company/project
   * - employee owns assignment
   * - project membership is active
   * - task can be started
   * - no OPEN work session exists
   */
  @Post(
    ":taskUuid/start-work",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Start work on assigned project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  startWork(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Body()
    dto: TaskWorkLocationDto,
  ) {
    return this.projectTaskService
      .startWork(
        req.user.companyId,
        projectUuid,
        taskUuid,
        req.user.id,
        req.user.employeeId,
        dto,
      );
  }


  /*
   * Employee:
   * Stop current work session.
   *
   * Task remains IN_PROGRESS.
   * Only current OPEN work
   * session closes.
   */
  @Post(
    ":taskUuid/stop-work",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Stop work on assigned project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  stopWork(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

     @Body()
  dto: TaskWorkLocationDto,
  ) {
    return this.projectTaskService
      .stopWork(
        req.user.companyId,
        projectUuid,
        taskUuid,
        req.user.id,
        req.user.employeeId,
        dto,
      );
  }


  /*
   * Employee:
   * Add execution report to
   * assigned task.
   *
   * Allowed report types:
   *
   * - PROGRESS
   * - BLOCKER
   * - NOTE
   *
   * COMPLETION is reserved for
   * completion-request workflow.
   *
   * Service verifies:
   *
   * - employee context
   * - active project membership
   * - assignment ownership
   * - task is IN_PROGRESS
   * - allowed report type
   */
  @Post(
    ":taskUuid/reports",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Add progress, blocker or note to assigned task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  createTaskReport(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Body()
    dto:
      CreateProjectTaskReportDto,
  ) {
    return this.projectTaskService
      .createTaskReport(
        req.user.companyId,
        projectUuid,
        taskUuid,
        req.user.id,
        req.user.employeeId,
        dto,
      );
  }


  /*
   * Employee:
   * Request task completion.
   *
   * Flow:
   *
   * IN_PROGRESS
   *      ↓
   * COMPLETION report
   *      ↓
   * PENDING completion request
   *      ↓
   * COMPLETION_REQUESTED
   *
   * Service verifies:
   *
   * - employee context
   * - active project membership
   * - assignment ownership
   * - task is IN_PROGRESS
   * - no OPEN work session
   * - no existing PENDING request
   */
  @Post(
    ":taskUuid/request-completion",
  )
  @RequirePermission(
    "company.task.execute",
  )
  @ApiOperation({
    summary:
      "Request completion of assigned project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  requestCompletion(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Body()
    dto:
      RequestProjectTaskCompletionDto,
  ) {
    return this.projectTaskService
      .requestCompletion(
        req.user.companyId,
        projectUuid,
        taskUuid,
        req.user.id,
        req.user.employeeId,
        dto,
      );
  }


  /*
   * Manager / authorized user:
   * Review employee completion request.
   *
   * APPROVED:
   *
   * COMPLETION_REQUESTED
   *        ↓
   * COMPLETED
   *
   * REJECTED:
   *
   * COMPLETION_REQUESTED
   *        ↓
   * IN_PROGRESS
   *
   * Service verifies:
   *
   * - company context
   * - reviewer employee context
   * - active project membership
   * - task belongs to company/project
   * - task is COMPLETION_REQUESTED
   * - PENDING completion request exists
   * - rejection includes review note
   */
  @Post(
    ":taskUuid/review-completion",
  )
  @RequirePermission(
    "company.task.update",
  )
  @ApiOperation({
    summary:
      "Approve or reject project task completion request",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  reviewCompletion(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Body()
    dto:
      ReviewProjectTaskCompletionDto,
  ) {
    return this.projectTaskService
      .reviewCompletion(
        req.user.companyId,
        projectUuid,
        taskUuid,
        req.user.id,
        req.user.employeeId,
        dto,
      );
  }

/*
 * =========================================================
 * PROJECT TASK REPORT ATTACHMENT VIEW
 * =========================================================
 *
 * Manager / Company Admin / authorized
 * project-task viewer:
 *
 * Private report evidence ke liye
 * temporary signed GET URL generate karo.
 *
 * Authorization:
 *
 * - PermissionGuard:
 *   company.task.view
 *
 * - Service:
 *   effective permission scope enforce karega
 *
 * PROJECT:
 *   active project membership required
 *
 * COMPANY:
 *   same company project/task allowed
 *
 * OWN / TEAM / ORGANIZATION_UNIT:
 *   existing task visibility rules ke
 *   according service fail-closed karega.
 *
 * Important:
 * Employee My Tasks endpoint se separate hai.
 */
@Get(
  ":taskUuid/report-attachments/:attachmentUuid/view-url",
)
@RequirePermission(
  "company.task.view",
)
@ApiOperation({
  summary:
    "Get temporary view URL for project task report attachment",
})
@ApiParam({
  name:
    "projectUuid",

  description:
    "Project UUID",
})
@ApiParam({
  name:
    "taskUuid",

  description:
    "Project Task UUID",
})
@ApiParam({
  name:
    "attachmentUuid",

  description:
    "Project Task Report Attachment UUID",
})
getReportAttachmentViewUrl(
  @Req()
  req: AuthenticatedRequest,

  @Param(
    "projectUuid",
  )
  projectUuid: string,

  @Param(
    "taskUuid",
  )
  taskUuid: string,

  @Param(
    "attachmentUuid",
  )
  attachmentUuid: string,
) {
  return this.projectTaskService
    .getReportAttachmentViewUrl(
      req.user.companyId,
      projectUuid,
      taskUuid,
      attachmentUuid,
      req.user.id,
      req.user.employeeId,
    );
}



/*
 * =========================================================
 * TASK WORK SUMMARY
 * =========================================================
 *
 * Manager / Company Admin ke liye
 * date-wise worked duration.
 *
 * Raw punch-in / punch-out timestamps
 * frontend ko expose nahi hote.
 *
 * Authorization:
 *
 * company.task.view
 *
 * Actual COMPANY / PROJECT scope
 * service layer enforce karti hai.
 */
@Get(":taskUuid/work-summary")
@RequirePermission(
  "company.task.view",
)
@ApiOperation({
  summary:
    "Get project task work summary",
})
@ApiParam({
  name:
    "projectUuid",

  description:
    "Project UUID",
})
@ApiParam({
  name:
    "taskUuid",

  description:
    "Project task UUID",
})
getWorkSummary(
  @Req()
  req: any,

  @Param(
    "projectUuid",
  )
  projectUuid:
    string,

  @Param(
    "taskUuid",
  )
  taskUuid:
    string,
) {
  return this.projectTaskService
    .getWorkSummary(
      req.user.companyId,
      projectUuid,
      taskUuid,
      req.user.id,
      req.user.employeeId,
    );
}





  /*
   * View task details.
   */
  @Get(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.view",
  )
  @ApiOperation({
    summary:
      "Get project task details",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,
  ) {
    return this.projectTaskService
      .findByUuid(
        req.user.companyId,
        projectUuid,
        taskUuid,
      );
  }


  /*
   * Manager / authorized user:
   * Edit planning fields.
   *
   * Employee execution should NOT
   * use this endpoint.
   */
  @Patch(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.update",
  )
  @ApiOperation({
    summary:
      "Update project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,

    @Body()
    dto:
      UpdateProjectTaskDto,
  ) {
    return this.projectTaskService
      .updateByUuid(
        req.user.companyId,
        projectUuid,
        taskUuid,
        dto,
      );
  }


  /*
   * Manager / authorized user:
   * Delete / cancel task.
   */
  @Delete(
    ":taskUuid",
  )
  @RequirePermission(
    "company.task.delete",
  )
  @ApiOperation({
    summary:
      "Delete project task",
  })
  @ApiParam({
    name:
      "projectUuid",

    description:
      "Project UUID",
  })
  @ApiParam({
    name:
      "taskUuid",

    description:
      "Project Task UUID",
  })
  remove(
    @Req()
    req: AuthenticatedRequest,

    @Param(
      "projectUuid",
    )
    projectUuid: string,

    @Param(
      "taskUuid",
    )
    taskUuid: string,
  ) {
    return this.projectTaskService
      .deleteByUuid(
        req.user.companyId,
        projectUuid,
        taskUuid,
      );
  }
}