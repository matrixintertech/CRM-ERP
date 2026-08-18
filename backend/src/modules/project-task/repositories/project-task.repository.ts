import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  ProjectTaskAttachmentType,
  ProjectTaskCompletionStatus,
  ProjectTaskReportType,
  ProjectTaskStatus,
  ProjectTaskWorkSessionStatus,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";


interface CreateTaskReportAttachmentInput {
  type:
    ProjectTaskAttachmentType;

  originalName:
    string;

  mimeType:
    string;

  sizeBytes:
    bigint;

  storageKey:
    string;
}

@Injectable()
export class ProjectTaskRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  async findProjectByUuid(
    companyId: bigint,
    projectUuid: string,
  ) {
    return this.prisma.project.findFirst({
      where: {
        uuid:
          projectUuid,

        companyId,

        deletedAt:
          null,
      },
    });
  }


  async findActiveProjectMemberByUuid(
    companyId: bigint,
    projectId: bigint,
    memberUuid: string,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        uuid:
          memberUuid,

        companyId,

        projectId,

        isActive:
          true,
      },

      include: {
        employee: {
          include: {
            designation:
              true,

            department:
              true,
          },
        },

        projectRole:
          true,
      },
    });
  }


  async create(
    data:
      Prisma.ProjectTaskCreateInput,
  ) {
    return this.prisma.projectTask.create({
      data,

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }


 async findAllByProject(
  companyId: bigint,
  projectId: bigint,
) {
  return this.prisma.projectTask.findMany({
    where: {
      companyId,

      projectId,

      deletedAt:
        null,
    },

    include: {
      assignedProjectMember: {
        include: {
          employee: {
            include: {
              designation:
                true,

              department:
                true,
            },
          },

          projectRole:
            true,
        },
      },


      /*
       * Manager review ke liye
       * latest PENDING completion
       * request return karo.
       */
      completionRequests: {
        where: {
          status:
            ProjectTaskCompletionStatus
              .PENDING,
        },

        orderBy: {
          requestedAt:
            "desc",
        },

        take:
          1,

        select: {
          uuid:
            true,

          status:
            true,

          workedSeconds:
            true,

          requestedAt:
            true,

          reviewNote:
            true,

          /*
           * Employee jis project
           * membership se request
           * submit kiya.
           */
          requestedByProjectMember: {
            select: {
              uuid:
                true,

              employee: {
                select: {
                  uuid:
                    true,

                  employeeCode:
                    true,

                  firstName:
                    true,

                  lastName:
                    true,

                  displayName:
                    true,

                  designation: {
                    select: {
                      uuid:
                        true,

                      name:
                        true,
                    },
                  },

                  department: {
                    select: {
                      uuid:
                        true,

                      name:
                        true,
                    },
                  },
                },
              },

              projectRole: {
                select: {
                  uuid:
                    true,

                  name:
                    true,

                  code:
                    true,
                },
              },
            },
          },


          /*
           * Completion summary
           * employee ne request ke
           * time submit ki thi.
           */
          report: {
            select: {
              uuid:
                true,

              type:
                true,

              message:
                true,

              taskStatusSnapshot:
                true,

              createdAt:
                true,
            },
          },
        },
      },
    },

    orderBy: [
      {
        sortOrder:
          "asc",
      },

      {
        dueDate:
          "asc",
      },

      {
        createdAt:
          "desc",
      },
    ],
  });
}


  async findByUuid(
    companyId: bigint,
    projectId: bigint,
    taskUuid: string,
  ) {
    return this.prisma.projectTask.findFirst({
      where: {
        uuid:
          taskUuid,

        companyId,

        projectId,

        deletedAt:
          null,
      },

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }


  async update(
    id: bigint,
    data:
      Prisma.ProjectTaskUpdateInput,
  ) {
    return this.prisma.projectTask.update({
      where: {
        id,
      },

      data,

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }


  /*
   * Logged-in employee ke
   * assigned tasks.
   *
   * Cross-project query hai.
   */
async findMyTasks(
  companyId: bigint,
  employeeId: bigint,
) {
  return this.prisma.projectTask.findMany({
    where: {
      companyId,

      deletedAt:
        null,

      assignedProjectMember: {
        employeeId,

        isActive:
          true,
      },
    },

    include: {
      project: {
        select: {
          uuid:
            true,

          srn:
            true,

          name:
            true,
        },
      },

      assignedProjectMember: {
        include: {
          employee: {
            include: {
              designation:
                true,

              department:
                true,
            },
          },

          projectRole:
            true,
        },
      },

      /*
       * Current employee ka
       * active/open work session.
       *
       * Maximum one latest session
       * frontend ko chahiye.
       */
      workSessions: {
        where: {
          user: {
            employeeId,
          },

          status:
            ProjectTaskWorkSessionStatus.OPEN,
        },

        orderBy: {
          punchInAt:
            "desc",
        },

        take:
          1,
      },

      /*
       * Pending completion request
       * frontend ko "Waiting Review"
       * state show karne ke liye.
       */
      completionRequests: {
        where: {
          status:
            ProjectTaskCompletionStatus.PENDING,
        },

        orderBy: {
          requestedAt:
            "desc",
        },

        take:
          1,
      },

      /*
       * Latest task reports / activity.
       *
       * My Tasks activity modal me
       * PROGRESS, BLOCKER, NOTE aur
       * future COMPLETION reports
       * show karne ke liye.
       *
       * Attachments metadata bhi return
       * hogi so frontend later signed
       * download URL request kar sake.
       */
      reports: {
        orderBy: {
          createdAt:
            "desc",
        },

        take:
          20,

        select: {
          uuid:
            true,

          type:
            true,

          message:
            true,

          taskStatusSnapshot:
            true,

          createdAt:
            true,

          /*
           * Report evidence attachments.
           *
           * Private R2/S3 URL DB me store
           * nahi hota.
           *
           * Sirf storageKey + metadata
           * return karte hain.
           */
          attachments: {
            orderBy: {
              createdAt:
                "asc",
            },

            select: {
              uuid:
                true,

              type:
                true,

              originalName:
                true,

              mimeType:
                true,

              sizeBytes:
                true,

              storageKey:
                true,

              createdAt:
                true,
            },
          },

          projectMember: {
            select: {
              uuid:
                true,

              employee: {
                select: {
                  uuid:
                    true,

                  displayName:
                    true,

                  firstName:
                    true,

                  lastName:
                    true,
                },
              },

              projectRole: {
                select: {
                  uuid:
                    true,

                  name:
                    true,

                  code:
                    true,
                },
              },
            },
          },
        },
      },

      /*
       * Total report count.
       *
       * Frontend:
       * View Activity (5)
       */
      _count: {
        select: {
          reports:
            true,
        },
      },
    },

    orderBy: [
      {
        dueDate:
          "asc",
      },

      {
        priority:
          "desc",
      },

      {
        createdAt:
          "desc",
      },
    ],
  });
}


  /*
   * Find current OPEN work session
   * for a specific task/member/user.
   */
  async findOpenWorkSession(
    companyId: bigint,
    taskId: bigint,
    projectMemberId: bigint,
    userId: bigint,
  ) {
    return this.prisma
      .projectTaskWorkSession
      .findFirst({
        where: {
          companyId,

          taskId,

          projectMemberId,

          userId,

          status:
            ProjectTaskWorkSessionStatus.OPEN,
        },

        orderBy: {
          punchInAt:
            "desc",
        },
      });
  }


  /*
   * Start work.
   *
   * Important:
   * - Task assignment is rechecked
   *   inside the transaction.
   *
   * - Duplicate OPEN session is checked.
   *
   * - TODO -> IN_PROGRESS and
   *   work-session creation happen
   *   atomically.
   */
  async startWork(
    companyId: bigint,
    projectId: bigint,
    taskId: bigint,
    projectMemberId: bigint,
    userId: bigint,
  ) {
    return this.prisma.$transaction(
      async (
        tx,
      ) => {
        /*
         * Re-read task inside transaction
         * so stale service data cannot start
         * work for a reassigned task.
         */
        const task =
          await tx.projectTask.findFirst({
            where: {
              id:
                taskId,

              companyId,

              projectId,

              assignedProjectMemberId:
                projectMemberId,

              deletedAt:
                null,
            },

            select: {
              id:
                true,

              uuid:
                true,

              status:
                true,
            },
          });


        if (!task) {
          return {
            outcome:
              "TASK_NOT_AVAILABLE" as const,
          };
        }


        /*
         * Employee can start:
         *
         * TODO
         * IN_PROGRESS
         *
         * IN_PROGRESS is required because
         * employee can stop and later
         * resume the same task.
         */
        if (
          task.status !==
            ProjectTaskStatus.TODO &&
          task.status !==
            ProjectTaskStatus.IN_PROGRESS
        ) {
          return {
            outcome:
              "INVALID_STATUS" as const,

            status:
              task.status,
          };
        }


        const existingOpenSession =
          await tx
            .projectTaskWorkSession
            .findFirst({
              where: {
                companyId,

                taskId,

                projectMemberId,

                userId,

                status:
                  ProjectTaskWorkSessionStatus.OPEN,
              },

              orderBy: {
                punchInAt:
                  "desc",
              },
            });


        if (
          existingOpenSession
        ) {
          return {
            outcome:
              "ALREADY_OPEN" as const,

            workSession:
              existingOpenSession,
          };
        }


        const workSession =
          await tx
            .projectTaskWorkSession
            .create({
              data: {
                company: {
                  connect: {
                    id:
                      companyId,
                  },
                },

                task: {
                  connect: {
                    id:
                      taskId,
                  },
                },

                projectMember: {
                  connect: {
                    id:
                      projectMemberId,
                  },
                },

                user: {
                  connect: {
                    id:
                      userId,
                  },
                },

                status:
                  ProjectTaskWorkSessionStatus.OPEN,

                punchInAt:
                  new Date(),
              },
            });


        /*
         * First execution starts task.
         */
        if (
          task.status ===
          ProjectTaskStatus.TODO
        ) {
          await tx.projectTask.update({
            where: {
              id:
                taskId,
            },

            data: {
              status:
                ProjectTaskStatus.IN_PROGRESS,
            },
          });
        }


        const projectTask =
          await tx.projectTask.findUnique({
            where: {
              id:
                taskId,
            },

            include: {
              assignedProjectMember: {
                include: {
                  employee: {
                    include: {
                      designation:
                        true,

                      department:
                        true,
                    },
                  },

                  projectRole:
                    true,
                },
              },

              project:
                true,
            },
          });


        return {
          outcome:
            "STARTED" as const,

          projectTask,

          workSession,
        };
      },

      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
      },
    );
  }


  /*
   * Stop employee's currently OPEN
   * work session.
   *
   * Task itself remains IN_PROGRESS.
   */
  async stopWork(
    companyId: bigint,
    taskId: bigint,
    projectMemberId: bigint,
    userId: bigint,
  ) {
    return this.prisma.$transaction(
      async (
        tx,
      ) => {
        const openSession =
          await tx
            .projectTaskWorkSession
            .findFirst({
              where: {
                companyId,

                taskId,

                projectMemberId,

                userId,

                status:
                  ProjectTaskWorkSessionStatus.OPEN,
              },

              orderBy: {
                punchInAt:
                  "desc",
              },
            });


        if (!openSession) {
          return {
            outcome:
              "NO_OPEN_SESSION" as const,
          };
        }


        const punchOutAt =
          new Date();


        const durationSeconds =
          Math.max(
            0,

            Math.floor(
              (
                punchOutAt.getTime() -
                openSession.punchInAt.getTime()
              ) /
                1000,
            ),
          );


        /*
         * updateMany lets us keep
         * status=OPEN in the condition.
         *
         * Two simultaneous stop requests
         * cannot both close same session.
         */
        const closeResult =
          await tx
            .projectTaskWorkSession
            .updateMany({
              where: {
                id:
                  openSession.id,

                status:
                  ProjectTaskWorkSessionStatus.OPEN,
              },

              data: {
                status:
                  ProjectTaskWorkSessionStatus.CLOSED,

                punchOutAt,

                durationSeconds,
              },
            });


        if (
          closeResult.count ===
          0
        ) {
          return {
            outcome:
              "NO_OPEN_SESSION" as const,
          };
        }


        const workSession =
          await tx
            .projectTaskWorkSession
            .findUnique({
              where: {
                id:
                  openSession.id,
              },
            });


        return {
          outcome:
            "STOPPED" as const,

          workSession,
        };
      },

      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .Serializable,
      },
    );
  }


  /*
 * Employee task report:
 *
 * PROGRESS
 * BLOCKER
 * NOTE
 *
 * Important:
 * - Assignment transaction ke andar
 *   dobara validate hoti hai.
 *
 * - Report sirf IN_PROGRESS task
 *   par create hogi.
 *
 * - Current task status automatically
 *   taskStatusSnapshot me save hota hai.
 */
async createTaskReport(
  companyId: bigint,
  projectId: bigint,
  taskId: bigint,
  projectMemberId: bigint,
  userId: bigint,
  type: ProjectTaskReportType,
  message: string,
  attachments:
    CreateTaskReportAttachmentInput[] =
      [],
) {
  return this.prisma.$transaction(
    async (
      tx,
    ) => {
      /*
       * Re-read task inside transaction
       * so stale service data cannot
       * create report after reassignment.
       */
      const task =
        await tx.projectTask.findFirst({
          where: {
            id:
              taskId,

            companyId,

            projectId,

            assignedProjectMemberId:
              projectMemberId,

            deletedAt:
              null,
          },

          select: {
            id:
              true,

            uuid:
              true,

            status:
              true,
          },
        });


      if (!task) {
        return {
          outcome:
            "TASK_NOT_AVAILABLE" as const,
        };
      }


      /*
       * Employee work updates are only
       * allowed while task is actively
       * IN_PROGRESS.
       */
      if (
        task.status !==
        ProjectTaskStatus.IN_PROGRESS
      ) {
        return {
          outcome:
            "INVALID_STATUS" as const,

          status:
            task.status,
        };
      }


      /*
       * =====================================================
       * REPORT + ATTACHMENTS
       * =====================================================
       *
       * Storage objects were already
       * verified by service through HEAD.
       *
       * DB report and attachment metadata
       * are now saved atomically.
       */
    const report =
  await tx.projectTaskReport.create({
    data: {
      company: {
        connect: {
          id:
            companyId,
        },
      },

      task: {
        connect: {
          id:
            taskId,
        },
      },

      projectMember: {
        connect: {
          id:
            projectMemberId,
        },
      },

      user: {
        connect: {
          id:
            userId,
        },
      },

      type,

      message:
        message.trim(),

      taskStatusSnapshot:
        task.status,

      /*
       * Empty attachment array:
       * relation create omitted.
       */
      ...(attachments.length >
        0 && {
        attachments: {
          create:
            attachments.map(
              (
                attachment,
              ) => ({
                type:
                  attachment.type,

                originalName:
                  attachment
                    .originalName
                    .trim(),

                mimeType:
                  attachment
                    .mimeType
                    .trim()
                    .toLowerCase(),

                sizeBytes:
                  attachment
                    .sizeBytes,

                storageKey:
                  attachment
                    .storageKey
                    .trim(),
              }),
            ),
        },
      }),
    },

    include: {
      projectMember: {
        include: {
          employee: {
            include: {
              designation:
                true,

              department:
                true,
            },
          },

          projectRole:
            true,
        },
      },

      /*
       * Created attachment metadata
       * response me bhi return karo.
       */
      attachments: {
        select: {
          uuid:
            true,

          type:
            true,

          originalName:
            true,

          mimeType:
            true,

          sizeBytes:
            true,

          storageKey:
            true,

          createdAt:
            true,
        },
      },
    },
  });


      return {
        outcome:
          "CREATED" as const,

        report,
      };
    },

    {
      isolationLevel:
        Prisma.TransactionIsolationLevel
          .Serializable,
    },
  );
}

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.projectTask.update({
      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          ProjectTaskStatus.CANCELLED,
      },
    });
  }

  async requestCompletion(
  companyId: bigint,
  projectUuid: string,
  taskUuid: string,
  userId: bigint,
  employeeId: bigint,
  message: string,
) {
  return this.prisma.$transaction(
    async (
      tx,
    ) => {
      /*
       * Task ko transaction ke andar
       * dobara verify karo.
       *
       * Employee sirf apna assigned
       * active task complete request
       * kar sakta hai.
       */
      const task =
        await tx.projectTask.findFirst({
          where: {
            companyId,

            uuid:
              taskUuid,

            deletedAt:
              null,

            project: {
              uuid:
                projectUuid,

              companyId,
            },

            assignedProjectMember: {
              employeeId,

              isActive:
                true,

              companyId,
            },
          },

          select: {
            id:
              true,

            uuid:
              true,

            status:
              true,

            assignedProjectMemberId:
              true,

            assignedProjectMember: {
              select: {
                id:
                  true,

                uuid:
                  true,

                employeeId:
                  true,

                isActive:
                  true,
              },
            },
          },
        });


      if (
        !task ||
        !task.assignedProjectMemberId
      ) {
        throw new Error(
          "TASK_NOT_AVAILABLE",
        );
      }


      /*
       * Completion request sirf
       * IN_PROGRESS task se possible.
       */
      if (
        task.status !==
        ProjectTaskStatus.IN_PROGRESS
      ) {
        throw new Error(
          "INVALID_STATUS",
        );
      }


      /*
       * Active work session ke saath
       * completion request allow nahi.
       *
       * Employee pehle Stop Work karega,
       * uske baad Request Completion.
       */
      const openWorkSession =
        await tx.projectTaskWorkSession
          .findFirst({
            where: {
              companyId,

              taskId:
                task.id,

              projectMemberId:
                task
                  .assignedProjectMemberId,

              userId,

              status:
                ProjectTaskWorkSessionStatus.OPEN,
            },

            select: {
              id:
                true,
            },
          });


      if (
        openWorkSession
      ) {
        throw new Error(
          "WORK_SESSION_OPEN",
        );
      }


      /*
       * Defensive check:
       * same task par already pending
       * completion request nahi honi
       * chahiye.
       */
      const existingRequest =
        await tx
          .projectTaskCompletionRequest
          .findFirst({
            where: {
              companyId,

              taskId:
                task.id,

              status:
                ProjectTaskCompletionStatus.PENDING,
            },

            select: {
              id:
                true,
            },
          });


      if (
        existingRequest
      ) {
        throw new Error(
          "COMPLETION_ALREADY_REQUESTED",
        );
      }


      /*
       * Employee ka total completed
       * work duration calculate karo.
       *
       * OPEN session allowed nahi hai,
       * isliye CLOSED sessions ka sum
       * final workedSeconds hoga.
       */
      const workedTime =
        await tx
          .projectTaskWorkSession
          .aggregate({
            where: {
              companyId,

              taskId:
                task.id,

              projectMemberId:
                task
                  .assignedProjectMemberId,

              userId,

              status:
                ProjectTaskWorkSessionStatus.CLOSED,
            },

            _sum: {
              durationSeconds:
                true,
            },
          });


      const workedSeconds =
        workedTime._sum
          .durationSeconds ??
        0;


      /*
       * Dedicated COMPLETION report.
       *
       * Generic reports endpoint
       * COMPLETION type allow nahi karta.
       */
      const report =
        await tx.projectTaskReport.create({
          data: {
            companyId,

            taskId:
              task.id,

            projectMemberId:
              task
                .assignedProjectMemberId,

            userId,

            type:
              ProjectTaskReportType.COMPLETION,

            message,

            /*
             * Snapshot request ke time
             * IN_PROGRESS hi rahega.
             */
            taskStatusSnapshot:
              task.status,
          },

          select: {
            id:
              true,

            uuid:
              true,

            type:
              true,

            message:
              true,

            taskStatusSnapshot:
              true,

            createdAt:
              true,
          },
        });


      /*
       * Manager review ke liye
       * PENDING completion request.
       */
      const completionRequest =
        await tx
          .projectTaskCompletionRequest
          .create({
            data: {
              companyId,

              taskId:
                task.id,

              requestedByProjectMemberId:
                task
                  .assignedProjectMemberId,

              requestedByUserId:
                userId,

              reportId:
                report.id,

              status:
                ProjectTaskCompletionStatus.PENDING,

              workedSeconds,
            },

            select: {
              uuid:
                true,

              status:
                true,

              workedSeconds:
                true,

              requestedAt:
                true,

              report: {
                select: {
                  uuid:
                    true,

                  type:
                    true,

                  message:
                    true,

                  taskStatusSnapshot:
                    true,

                  createdAt:
                    true,
                },
              },
            },
          });


      /*
       * Task state transition:
       *
       * IN_PROGRESS
       *      ↓
       * COMPLETION_REQUESTED
       */
      const updatedTask =
        await tx.projectTask.update({
          where: {
            id:
              task.id,
          },

          data: {
            status:
              ProjectTaskStatus
                .COMPLETION_REQUESTED,
          },

          select: {
            uuid:
              true,

            status:
              true,

            updatedAt:
              true,
          },
        });


      return {
        task:
          updatedTask,

        completionRequest,
      };
    },

    {
      isolationLevel:
        Prisma.TransactionIsolationLevel
          .Serializable,
    },
  );
}


async reviewCompletion(
  companyId: bigint,
  projectUuid: string,
  taskUuid: string,
  reviewerUserId: bigint,
  decision:
    ProjectTaskCompletionStatus,
  reviewNote?: string,
) {
  return this.prisma.$transaction(
    async (
      tx,
    ) => {
      /*
       * Task + latest PENDING
       * completion request verify karo.
       */
      const task =
        await tx.projectTask.findFirst({
          where: {
            companyId,

            uuid:
              taskUuid,

            deletedAt:
              null,

            project: {
              uuid:
                projectUuid,

              companyId,
            },
          },

          select: {
            id:
              true,

            uuid:
              true,

            status:
              true,

            completionRequests: {
              where: {
                status:
                  ProjectTaskCompletionStatus
                    .PENDING,
              },

              orderBy: {
                requestedAt:
                  "desc",
              },

              take:
                1,

              select: {
                id:
                  true,

                uuid:
                  true,

                status:
                  true,

                requestedAt:
                  true,

                workedSeconds:
                  true,
              },
            },
          },
        });


      if (
        !task
      ) {
        throw new Error(
          "TASK_NOT_AVAILABLE",
        );
      }


      /*
       * Manager review sirf
       * COMPLETION_REQUESTED task
       * par possible hai.
       */
      if (
        task.status !==
        ProjectTaskStatus
          .COMPLETION_REQUESTED
      ) {
        throw new Error(
          "INVALID_TASK_STATUS",
        );
      }


      const completionRequest =
        task.completionRequests[
          0
        ];


      if (
        !completionRequest
      ) {
        throw new Error(
          "PENDING_COMPLETION_REQUEST_NOT_FOUND",
        );
      }


      /*
       * Defensive decision validation.
       *
       * PENDING ko review decision
       * ke roop me allow nahi karna.
       */
      if (
        decision !==
          ProjectTaskCompletionStatus
            .APPROVED &&
        decision !==
          ProjectTaskCompletionStatus
            .REJECTED
      ) {
        throw new Error(
          "INVALID_DECISION",
        );
      }


      const reviewedAt =
        new Date();


      /*
       * Completion request review
       * information save karo.
       *
       * Schema fields:
       * reviewedByUserId
       * reviewedAt
       * reviewNote
       */
      const reviewedRequest =
        await tx
          .projectTaskCompletionRequest
          .update({
            where: {
              id:
                completionRequest.id,
            },

            data: {
              status:
                decision,

              reviewedByUserId:
                reviewerUserId,

              reviewedAt,

              reviewNote:
                reviewNote ??
                null,
            },

            select: {
              uuid:
                true,

              status:
                true,

              workedSeconds:
                true,

              requestedAt:
                true,

              reviewedAt:
                true,

              reviewNote:
                true,

              reviewedByUser: {
                select: {
                  id:
                    true,

                  uuid:
                    true,
                },
              },

              report: {
                select: {
                  uuid:
                    true,

                  type:
                    true,

                  message:
                    true,

                  taskStatusSnapshot:
                    true,

                  createdAt:
                    true,
                },
              },
            },
          });


      /*
       * Task state transition.
       *
       * APPROVED:
       * COMPLETION_REQUESTED
       *        ↓
       * COMPLETED
       *
       * REJECTED:
       * COMPLETION_REQUESTED
       *        ↓
       * IN_PROGRESS
       */
      const updatedTask =
        await tx.projectTask.update({
          where: {
            id:
              task.id,
          },

          data:
            decision ===
            ProjectTaskCompletionStatus
              .APPROVED
              ? {
                  status:
                    ProjectTaskStatus
                      .COMPLETED,

                  completedAt:
                    reviewedAt,
                }
              : {
                  status:
                    ProjectTaskStatus
                      .IN_PROGRESS,

                  completedAt:
                    null,
                },

          select: {
            uuid:
              true,

            status:
              true,

            completedAt:
              true,

            updatedAt:
              true,
          },
        });


      return {
        task:
          updatedTask,

        completionRequest:
          reviewedRequest,
      };
    },

    {
      isolationLevel:
        Prisma.TransactionIsolationLevel
          .Serializable,
    },
  );
}


async findActiveProjectMemberByEmployeeId(
  companyId: bigint,
  projectId: bigint,
  employeeId: bigint,
) {
  return this.prisma.projectMember.findFirst({
    where: {
      companyId,

      projectId,

      employeeId,

      isActive:
        true,

      removedAt:
        null,
    },

    select: {
      id:
        true,

      uuid:
        true,

      companyId:
        true,

      projectId:
        true,

      employeeId:
        true,

      projectRoleId:
        true,

      isActive:
        true,

      projectRole: {
        select: {
          uuid:
            true,

          name:
            true,

          code:
            true,
        },
      },
    },
  });
}



}