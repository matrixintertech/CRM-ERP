import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import type {
  MyTask,
  MyTaskReport,
  MyTaskReportType,
} from "../types/my-task.types";


interface TaskActivityModalProps {
  open:
    boolean;

  task:
    MyTask | null;

  onClose:
    () => void;
}


const TaskActivityModal = ({
  open,
  task,
  onClose,
}: TaskActivityModalProps) => {
  return (
    <Modal
      open={
        open
      }
      title="Task Activity"
      onClose={
        onClose
      }
      size="lg"
    >
      {!task ? (
        <div
          style={{
            padding:
              "12px 0",

            color:
              "#6b7280",

            fontSize:
              14,
          }}
        >
          Task information is not available.
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",

            gap:
              20,
          }}
        >
          {/* Task Header */}

          <section
            style={{
              padding:
                "14px 16px",

              border:
                "1px solid #e5e7eb",

              borderRadius:
                10,

              background:
                "#f8fafc",
            }}
          >
            <div
              style={{
                color:
                  "#111827",

                fontSize:
                  16,

                fontWeight:
                  600,
              }}
            >
              {
                task.title
              }
            </div>


            <div
              style={{
                marginTop:
                  5,

                color:
                  "#6b7280",

                fontSize:
                  12,
              }}
            >
              {
                task.project.name
              }
              {" · "}
              {
                task.project.srn
              }
            </div>


            <div
              style={{
                display:
                  "flex",

                flexWrap:
                  "wrap",

                gap:
                  8,

                marginTop:
                  12,
              }}
            >
              <InfoBadge
                label="Status"
                value={
                  task.status.replace(
                    /_/g,
                    " ",
                  )
                }
              />

              <InfoBadge
                label="Priority"
                value={
                  task.priority
                }
              />

              <InfoBadge
                label="Updates"
                value={
                  String(
                    task._count
                      ?.reports ??
                      task.reports
                        ?.length ??
                      0,
                  )
                }
              />
            </div>
          </section>


          {/* Activity Timeline */}

          <section>
            <div
              style={{
                marginBottom:
                  12,

                color:
                  "#111827",

                fontSize:
                  14,

                fontWeight:
                  600,
              }}
            >
              Activity Timeline
            </div>


            {!task.reports ||
            task.reports.length ===
              0 ? (
              <div
                style={{
                  padding:
                    "28px 16px",

                  border:
                    "1px dashed #d1d5db",

                  borderRadius:
                    10,

                  color:
                    "#6b7280",

                  textAlign:
                    "center",

                  fontSize:
                    13,
                }}
              >
                No task activity yet.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",

                  gap:
                    14,
                }}
              >
                {task.reports.map(
                  (
                    report,
                  ) => (
                    <ActivityItem
                      key={
                        report.uuid
                      }
                      report={
                        report
                      }
                    />
                  ),
                )}
              </div>
            )}
          </section>


          {/* Footer */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              paddingTop:
                4,

              borderTop:
                "1px solid #f3f4f6",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={
                onClose
              }
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


const ActivityItem = ({
  report,
}: {
  report:
    MyTaskReport;
}) => {
  const config =
    getActivityConfig(
      report.type,
    );


  const employeeName =
    report.projectMember
      ?.employee
      ?.displayName?.trim() ||
    [
      report.projectMember
        ?.employee
        ?.firstName,

      report.projectMember
        ?.employee
        ?.lastName,
    ]
      .filter(
        Boolean,
      )
      .join(" ") ||
    "Employee";


  const projectRole =
    report.projectMember
      ?.projectRole
      ?.name;


  return (
    <article
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "12px minmax(0, 1fr)",

        gap:
          12,
      }}
    >
      {/* Timeline marker */}

      <div
        style={{
          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",
        }}
      >
        <div
          style={{
            width:
              10,

            height:
              10,

            marginTop:
              5,

            borderRadius:
              "50%",

            background:
              config.color,

            flexShrink:
              0,
          }}
        />

        <div
          style={{
            width:
              1,

            minHeight:
              75,

            flex:
              1,

            marginTop:
              5,

            background:
              "#e5e7eb",
          }}
        />
      </div>


      {/* Activity content */}

      <div
        style={{
          padding:
            "12px 14px",

          border:
            "1px solid #e5e7eb",

          borderRadius:
            10,

          background:
            "#ffffff",
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "flex-start",

            flexWrap:
              "wrap",

            gap:
              10,
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              flexWrap:
                "wrap",
            }}
          >
            <span
              style={{
                padding:
                  "4px 8px",

                borderRadius:
                  999,

                background:
                  config.background,

                color:
                  config.color,

                fontSize:
                  11,

                fontWeight:
                  700,
              }}
            >
              {
                config.label
              }
            </span>


            <span
              style={{
                color:
                  "#6b7280",

                fontSize:
                  11,
              }}
            >
              Status:{" "}
              {report.taskStatusSnapshot.replace(
                /_/g,
                " ",
              )}
            </span>
          </div>


          <span
            style={{
              color:
                "#6b7280",

              fontSize:
                11,

              whiteSpace:
                "nowrap",
            }}
          >
            {
              formatDateTime(
                report.createdAt,
              )
            }
          </span>
        </div>


        <div
          style={{
            marginTop:
              12,

            color:
              "#374151",

            fontSize:
              14,

            lineHeight:
              1.6,

            whiteSpace:
              "pre-wrap",

            overflowWrap:
              "anywhere",
          }}
        >
          {
            report.message
          }
        </div>


        <div
          style={{
            marginTop:
              12,

            paddingTop:
              10,

            borderTop:
              "1px solid #f3f4f6",

            color:
              "#6b7280",

            fontSize:
              11,
          }}
        >
          {employeeName}

          {projectRole && (
            <>
              {" · "}
              {projectRole}
            </>
          )}
        </div>
      </div>
    </article>
  );
};


const InfoBadge = ({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) => (
  <span
    style={{
      padding:
        "5px 9px",

      border:
        "1px solid #e5e7eb",

      borderRadius:
        999,

      background:
        "#ffffff",

      color:
        "#374151",

      fontSize:
        11,
    }}
  >
    <strong>
      {label}:
    </strong>{" "}
    {value}
  </span>
);


const getActivityConfig = (
  type:
    MyTaskReportType,
) => {
  switch (
    type
  ) {
    case "BLOCKER":
      return {
        label:
          "BLOCKER",

        background:
          "#fef2f2",

        color:
          "#b91c1c",
      };


    case "NOTE":
      return {
        label:
          "NOTE",

        background:
          "#f3f4f6",

        color:
          "#374151",
      };


    case "COMPLETION":
      return {
        label:
          "COMPLETION",

        background:
          "#f0fdf4",

        color:
          "#15803d",
      };


    case "PROGRESS":
    default:
      return {
        label:
          "PROGRESS",

        background:
          "#eff6ff",

        color:
          "#1d4ed8",
      };
  }
};


const formatDateTime = (
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

      hour:
        "2-digit",

      minute:
        "2-digit",
    },
  ).format(
    new Date(
      value,
    ),
  );


export default TaskActivityModal;