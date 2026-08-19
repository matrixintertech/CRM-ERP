
import Button from "@/shared/components/Button";

import type {
  MyTask,
} from "../types/my-task.types";


interface MyTaskTableProps {
  tasks:
    MyTask[];

  loading:
    boolean;

  canExecute:
    boolean;

  workLoading:
    boolean;

  reportLoading:
    boolean;

  completionLoading:
    boolean;

  onStartWork:
    (
      task: MyTask,
    ) => void;

  onStopWork:
    (
      task: MyTask,
    ) => void;

  onAddProgress:
    (
      task: MyTask,
    ) => void;

  onReportBlocker:
    (
      task: MyTask,
    ) => void;

  onAddNote:
    (
      task: MyTask,
    ) => void;

  onViewActivity:
    (
      task: MyTask,
    ) => void;

  onRequestCompletion:
    (
      task: MyTask,
    ) => void;
}


const MyTaskTable = ({
  tasks,
  loading,
  canExecute,
  workLoading,
  reportLoading,
  completionLoading,
  onStartWork,
  onStopWork,
  onAddProgress,
  onReportBlocker,
  onAddNote,
  onViewActivity,
  onRequestCompletion,
}: MyTaskTableProps) => {
  return (
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
              Work
            </th>

            <th
              style={{
                ...headerCellStyle,

                textAlign:
                  "right",
              }}
            >
              Updates
            </th>
          </tr>
        </thead>


        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={
                  8
                }
                style={
                  emptyCellStyle
                }
              >
                Loading your tasks...
              </td>
            </tr>
          ) : tasks.length ===
            0 ? (
            <tr>
              <td
                colSpan={
                  8
                }
                style={
                  emptyCellStyle
                }
              >
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map(
              (
                task,
              ) => {
                   /*
            * workSessions now contains history,
            * so index 0 ko OPEN assume nahi karenge.
            */
            const openSession =
              task.workSessions?.find(
                (
                  session,
                ) =>
                  session.status ===
                  "OPEN",
              );


            const isWorking =
              Boolean(
                openSession,
              );


                const overdue =
                  isTaskOverdue(
                    task,
                  );


                const reportCount =
                  task._count
                    ?.reports ??
                  task.reports
                    ?.length ??
                  0;


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

    minWidth:
      220,
  }}
>
<td
  style={{
    ...bodyCellStyle,

    textAlign:
      "right",
  }}
>
  {canExecute ? (
    <TaskWorkAction
      task={
        task
      }
      isWorking={
        isWorking
      }
      loading={
        workLoading
      }
      onStart={() =>
        onStartWork(
          task,
        )
      }
      onStop={() =>
        onStopWork(
          task,
        )
      }
    />
  ) : (
    "-"
  )}
</td>

</td>


                    <td
                      style={{
                        ...bodyCellStyle,

                        textAlign:
                          "right",
                      }}
                    >
                      <TaskUpdateActions
                        task={
                          task
                        }
                        canExecute={
                          canExecute
                        }
                        isWorking={
                          isWorking
                        }
                        reportLoading={
                          reportLoading
                        }
                        completionLoading={
                          completionLoading
                        }
                        reportCount={
                          reportCount
                        }
                        onAddProgress={() =>
                          onAddProgress(
                            task,
                          )
                        }
                        onReportBlocker={() =>
                          onReportBlocker(
                            task,
                          )
                        }
                        onAddNote={() =>
                          onAddNote(
                            task,
                          )
                        }
                        onViewActivity={() =>
                          onViewActivity(
                            task,
                          )
                        }
                        onRequestCompletion={() =>
                          onRequestCompletion(
                            task,
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              },
            )
          )}
        </tbody>
      </table>
    </div>
  );
};



interface TaskWorkActionProps {
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


const TaskWorkAction = ({
  task,
  isWorking,
  loading,
  onStart,
  onStop,
}: TaskWorkActionProps) => {
  if (
    task.status ===
    "COMPLETION_REQUESTED"
  ) {
    return (
      <span
        style={
          mutedActionStyle
        }
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
          ...mutedActionStyle,

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
        style={
          mutedActionStyle
        }
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


  return "-";
};


interface TaskUpdateActionsProps {
  task:
    MyTask;

  canExecute:
    boolean;

  isWorking:
    boolean;

  reportLoading:
    boolean;

  completionLoading:
    boolean;

  reportCount:
    number;

  onAddProgress:
    () => void;

  onReportBlocker:
    () => void;

  onAddNote:
    () => void;

  onViewActivity:
    () => void;

  onRequestCompletion:
    () => void;
}


const TaskUpdateActions = ({
  task,
  canExecute,
  isWorking,
  reportLoading,
  completionLoading,
  reportCount,
  onAddProgress,
  onReportBlocker,
  onAddNote,
  onViewActivity,
  onRequestCompletion,
}: TaskUpdateActionsProps) => {
  /*
   * Reports sirf IN_PROGRESS task
   * par add ho sakte hain.
   */
  const canAddReport =
    canExecute &&
    task.status ===
      "IN_PROGRESS";


  /*
   * Completion request:
   *
   * - employee has execute permission
   * - task IN_PROGRESS hai
   * - active OPEN work session nahi hai
   *
   * Backend bhi same rule enforce
   * karta hai.
   */
  const canRequestCompletion =
    canExecute &&
    task.status ===
      "IN_PROGRESS" &&
    !isWorking;


  return (
    <div
      style={{
        display:
          "flex",

        justifyContent:
          "flex-end",

        alignItems:
          "center",

        gap:
          6,

        flexWrap:
          "wrap",

        minWidth:
          300,
      }}
    >
      {canAddReport && (
        <>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={
              reportLoading ||
              completionLoading
            }
            onClick={
              onAddProgress
            }
          >
            Progress
          </Button>


          <Button
            type="button"
            size="sm"
            variant="danger"
            disabled={
              reportLoading ||
              completionLoading
            }
            onClick={
              onReportBlocker
            }
          >
            Blocker
          </Button>


          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={
              reportLoading ||
              completionLoading
            }
            onClick={
              onAddNote
            }
          >
            Note
          </Button>
        </>
      )}


      {canRequestCompletion && (
        <Button
          type="button"
          size="sm"
          loading={
            completionLoading
          }
          disabled={
            reportLoading
          }
          onClick={
            onRequestCompletion
          }
        >
          Request Completion
        </Button>
      )}


      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={
          reportLoading ||
          completionLoading
        }
        onClick={
          onViewActivity
        }
      >
        View Activity ({reportCount})
      </Button>
    </div>
  );
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
    {status.replace(
      /_/g,
      " ",
    )}
  </span>
);


const formatDate = (
  value:
    string,
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


const mutedActionStyle = {
  fontSize:
    12,

  color:
    "#6b7280",
};


export default MyTaskTable;