import {
  useMemo,
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import {
  useMyTasks,
} from "../hooks/useMyTasks";

import type {
  MyTask,
  ProjectTaskStatus,
} from "../types/my-task.types";


type TaskFilter =
  | "ALL"
  | ProjectTaskStatus;


const filters: Array<{
  label: string;
  value: TaskFilter;
}> = [
  {
    label:
      "All",

    value:
      "ALL",
  },

  {
    label:
      "Todo",

    value:
      "TODO",
  },

  {
    label:
      "In Progress",

    value:
      "IN_PROGRESS",
  },

  {
    label:
      "Pending Review",

    value:
      "COMPLETION_REQUESTED",
  },

  {
    label:
      "Completed",

    value:
      "COMPLETED",
  },
];


const MyTaskPage = () => {
  useDocumentTitle(
    "My Tasks",
  );


  const {
    hasPermission,
  } = useAuthorization();


  const canExecute =
    hasPermission(
      "company.task.execute",
    );


  const [
    activeFilter,
    setActiveFilter,
  ] = useState<TaskFilter>(
    "ALL",
  );


  const {
    tasks,
    loading,
    fetching,

    startWork,
    stopWork,

    starting,
    stopping,
  } = useMyTasks();


  const filteredTasks =
    useMemo(
      () => {
        if (
          activeFilter ===
          "ALL"
        ) {
          return tasks;
        }

        return tasks.filter(
          (
            task,
          ) =>
            task.status ===
            activeFilter,
        );
      },
      [
        tasks,
        activeFilter,
      ],
    );


  const counts =
    useMemo(
      () => ({
        ALL:
          tasks.length,

        TODO:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "TODO",
          ).length,

        IN_PROGRESS:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "IN_PROGRESS",
          ).length,

        COMPLETION_REQUESTED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "COMPLETION_REQUESTED",
          ).length,

        COMPLETED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "COMPLETED",
          ).length,

        CANCELLED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "CANCELLED",
          ).length,
      }),
      [
        tasks,
      ],
    );


  const handleStartWork =
    async (
      task: MyTask,
    ) => {
      if (
        !canExecute
      ) {
        return;
      }

      await startWork(
        task.project.uuid,
        task.uuid,
      );
    };


  const handleStopWork =
    async (
      task: MyTask,
    ) => {
      if (
        !canExecute
      ) {
        return;
      }

      await stopWork(
        task.project.uuid,
        task.uuid,
      );
    };


  return (
    <>
      <PageHeader
        title="My Tasks"
        subtitle="View and manage your assigned project tasks"
      />


      <Card>
        {/* Status Filters */}

        <div
          style={{
            display:
              "flex",

            gap:
              8,

            flexWrap:
              "wrap",

            marginBottom:
              24,
          }}
        >
          {filters.map(
            (
              filter,
            ) => {
              const active =
                activeFilter ===
                filter.value;

              const count =
                counts[
                  filter.value
                ] ?? 0;

              return (
                <Button
                  key={
                    filter.value
                  }
                  type="button"
                  size="sm"
                  variant={
                    active
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                >
                  {filter.label} ({count})
                </Button>
              );
            },
          )}
        </div>


        {fetching &&
          !loading && (
            <div
              style={{
                marginBottom:
                  12,

                fontSize:
                  12,

                color:
                  "#6b7280",
              }}
            >
              Updating tasks...
            </div>
          )}


        <div
          style={{
            overflowX:
              "auto",
          }}
        >
          <table
            style={{
              width:
                "100%",

              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={
                    headerCellStyle
                  }
                >
                  Task
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Project
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Role
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Priority
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Status
                </th>

                <th
                  style={
                    headerCellStyle
                  }
                >
                  Due Date
                </th>

                <th
                  style={{
                    ...headerCellStyle,

                    textAlign:
                      "right",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>


            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      7
                    }
                    style={
                      emptyCellStyle
                    }
                  >
                    Loading your tasks...
                  </td>
                </tr>
              ) : filteredTasks
                  .length ===
                0 ? (
                <tr>
                  <td
                    colSpan={
                      7
                    }
                    style={
                      emptyCellStyle
                    }
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(
                  (
                    task,
                  ) => {
                    const openSession =
                      task.workSessions?.[
                        0
                      ];

                    const isWorking =
                      Boolean(
                        openSession,
                      );

                    const overdue =
                      isTaskOverdue(
                        task,
                      );


                    return (
                      <tr
                        key={
                          task.uuid
                        }
                      >
                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          <div
                            style={{
                              fontWeight:
                                600,

                              color:
                                "#111827",
                            }}
                          >
                            {
                              task.title
                            }
                          </div>

                          {task.description && (
                            <div
                              style={{
                                marginTop:
                                  4,

                                maxWidth:
                                  340,

                                fontSize:
                                  12,

                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                task.description
                              }
                            </div>
                          )}
                        </td>


                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          <div>
                            {
                              task.project
                                .name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                3,

                              fontSize:
                                11,

                              color:
                                "#6b7280",
                            }}
                          >
                            {
                              task.project
                                .srn
                            }
                          </div>
                        </td>


                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          {
                            task
                              .assignedProjectMember
                              ?.projectRole
                              ?.name ??
                            "-"
                          }
                        </td>


                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          <PriorityBadge
                            priority={
                              task.priority
                            }
                          />
                        </td>


                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          <StatusBadge
                            status={
                              task.status
                            }
                          />

                          {isWorking && (
                            <div
                              style={{
                                marginTop:
                                  6,

                                fontSize:
                                  11,

                                fontWeight:
                                  600,

                                color:
                                  "#15803d",
                              }}
                            >
                              Work session active
                            </div>
                          )}
                        </td>


                        <td
                          style={
                            bodyCellStyle
                          }
                        >
                          {task.dueDate
                            ? formatDate(
                                task.dueDate,
                              )
                            : "-"}

                          {overdue && (
                            <div
                              style={{
                                marginTop:
                                  4,

                                fontSize:
                                  11,

                                fontWeight:
                                  600,

                                color:
                                  "#b91c1c",
                              }}
                            >
                              Overdue
                            </div>
                          )}
                        </td>


                        <td
                          style={{
                            ...bodyCellStyle,

                            textAlign:
                              "right",
                          }}
                        >
                          {canExecute && (
                            <TaskAction
                              task={
                                task
                              }
                              isWorking={
                                isWorking
                              }
                              loading={
                                starting ||
                                stopping
                              }
                              onStart={() =>
                                handleStartWork(
                                  task,
                                )
                              }
                              onStop={() =>
                                handleStopWork(
                                  task,
                                )
                              }
                            />
                          )}
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};


interface TaskActionProps {
  task:
    MyTask;

  isWorking:
    boolean;

  loading:
    boolean;

  onStart:
    () => void;

  onStop:
    () => void;
}


const TaskAction = ({
  task,
  isWorking,
  loading,
  onStart,
  onStop,
}: TaskActionProps) => {
  if (
    task.status ===
      "COMPLETION_REQUESTED"
  ) {
    return (
      <span
        style={{
          fontSize:
            12,

          color:
            "#6b7280",
        }}
      >
        Waiting for Review
      </span>
    );
  }


  if (
    task.status ===
      "COMPLETED"
  ) {
    return (
      <span
        style={{
          fontSize:
            12,

          color:
            "#15803d",
        }}
      >
        Completed
      </span>
    );
  }


  if (
    task.status ===
      "CANCELLED"
  ) {
    return (
      <span
        style={{
          fontSize:
            12,

          color:
            "#6b7280",
        }}
      >
        Cancelled
      </span>
    );
  }


  if (
    isWorking
  ) {
    return (
      <Button
        type="button"
        size="sm"
        variant="danger"
        loading={
          loading
        }
        onClick={
          onStop
        }
      >
        Stop Work
      </Button>
    );
  }


  if (
    task.status ===
      "TODO" ||
    task.status ===
      "IN_PROGRESS"
  ) {
    return (
      <Button
        type="button"
        size="sm"
        loading={
          loading
        }
        onClick={
          onStart
        }
      >
        {task.status ===
        "TODO"
          ? "Start Work"
          : "Resume Work"}
      </Button>
    );
  }


  return null;
};


const PriorityBadge = ({
  priority,
}: {
  priority:
    MyTask["priority"];
}) => (
  <span
    style={{
      padding:
        "5px 9px",

      borderRadius:
        999,

      background:
        "#f3f4f6",

      fontSize:
        11,

      fontWeight:
        600,
    }}
  >
    {priority}
  </span>
);


const StatusBadge = ({
  status,
}: {
  status:
    MyTask["status"];
}) => (
  <span
    style={{
      padding:
        "5px 9px",

      borderRadius:
        999,

      background:
        "#f3f4f6",

      fontSize:
        11,

      fontWeight:
        600,
    }}
  >
    {status.replaceAll(
      "_",
      " ",
    )}
  </span>
);


const formatDate = (
  value: string,
) =>
  new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    new Date(
      value,
    ),
  );


const isTaskOverdue = (
  task:
    MyTask,
) => {
  if (
    !task.dueDate ||
    task.status ===
      "COMPLETED" ||
    task.status ===
      "CANCELLED"
  ) {
    return false;
  }

  const due =
    new Date(
      task.dueDate,
    );

  const today =
    new Date();

  due.setHours(
    23,
    59,
    59,
    999,
  );

  return (
    due.getTime() <
    today.getTime()
  );
};


const headerCellStyle = {
  padding:
    "12px 14px",

  borderBottom:
    "1px solid #e5e7eb",

  background:
    "#f8fafc",

  color:
    "#374151",

  fontSize:
    12,

  fontWeight:
    600,

  textAlign:
    "left" as const,

  whiteSpace:
    "nowrap" as const,
};


const bodyCellStyle = {
  padding:
    "14px",

  borderBottom:
    "1px solid #e5e7eb",

  color:
    "#374151",

  fontSize:
    14,

  verticalAlign:
    "middle" as const,
};


const emptyCellStyle = {
  padding:
    "32px 16px",

  color:
    "#6b7280",

  textAlign:
    "center" as const,
};


export default MyTaskPage;