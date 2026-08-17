import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  ProjectTaskCompletionStatus,
  ProjectTaskStatus,
  ProjectTaskWorkSessionStatus,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";


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
}