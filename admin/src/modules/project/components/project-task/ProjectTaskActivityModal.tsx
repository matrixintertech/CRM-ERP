import {
  useEffect,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import {
  getProjectTaskWorkSummary,
} from "../../api/project-task.api";

import type {
  ProjectTaskWorkSummary,
} from "../../api/project-task.api";

import type {
  ProjectTask,
} from "../../types/project-task.types";

import ActivityInfoBadge from "./ActivityInfoBadge";
import CompletionReviewActivityItem from "./CompletionReviewActivityItem";
import ReportActivityItem from "./ReportActivityItem";

import {
  buildActivityTimeline,
} from "./project-task-activity.utils";

import type {
  ProjectTaskWithActivity,
} from "./project-task-activity.types";


type ActivityTab =
  | "ACTIVITY"
  | "WORK_LOG";


interface Props {
  open: boolean;

  projectUuid: string;

  task:
    ProjectTask | null;

  onClose:
    () => void;
}


const ProjectTaskActivityModal = ({
  open,
  projectUuid,
  task,
  onClose,
}: Props) => {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ActivityTab>(
      "ACTIVITY",
    );


  const activityTask =
    task as
      | ProjectTaskWithActivity
      | null;


  const activityItems =
    activityTask
      ? buildActivityTimeline(
          activityTask,
        )
      : [];


  const taskUuid =
    activityTask?.uuid ??
    "";


  /*
   * Modal open / task change par
   * default Activity tab open hoga.
   */
  useEffect(
    () => {
      if (
        open
      ) {
        setActiveTab(
          "ACTIVITY",
        );
      }
    },
    [
      open,
      taskUuid,
    ],
  );


  /*
   * =========================================================
   * WORK SUMMARY QUERY
   * =========================================================
   *
   * Important:
   *
   * Work Log tab open hone par hi
   * backend request hogi.
   *
   * Raw punch-in / punch-out frontend
   * ko nahi milte.
   */
  const {
    data:
      workSummary,

    isLoading:
      workSummaryLoading,

    isFetching:
      workSummaryFetching,

    isError:
      workSummaryError,

    refetch:
      refetchWorkSummary,
  } =
    useQuery({
      queryKey: [
        "project-task-work-summary",
        projectUuid,
        taskUuid,
      ],

      queryFn:
        () =>
          getProjectTaskWorkSummary(
            projectUuid,
            taskUuid,
          ),

      enabled:
        open &&
        activeTab ===
          "WORK_LOG" &&
        Boolean(
          taskUuid,
        ),

      staleTime:
        15 * 1000,

      /*
       * Manager Work Log tab open
       * rakhe to current running task
       * ka summary periodically refresh
       * hota rahe.
       */
      refetchInterval:
        activeTab ===
        "WORK_LOG"
          ? 30 * 1000
          : false,

      refetchOnWindowFocus:
        true,

      retry:
        1,
    });


  return (
    <Modal
      open={open}
      title="Task Activity"
      onClose={onClose}
      size="lg"
    >
      {!activityTask ? (
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
          {/* =====================================================
              TASK HEADER
              ===================================================== */}

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
              {activityTask.title}
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
              <ActivityInfoBadge
                label="Status"
                value={
                  String(
                    activityTask.status,
                  ).replace(
                    /_/g,
                    " ",
                  )
                }
              />


              <ActivityInfoBadge
                label="Priority"
                value={
                  String(
                    activityTask.priority,
                  )
                }
              />


              <ActivityInfoBadge
                label="Activity"
                value={
                  String(
                    activityItems.length,
                  )
                }
              />
            </div>
          </section>


          {/* =====================================================
              TABS
              ===================================================== */}

          <div
            role="tablist"
            aria-label="Task details"
            style={{
              display:
                "flex",

              gap:
                4,

              padding:
                4,

              border:
                "1px solid #e5e7eb",

              borderRadius:
                9,

              background:
                "#f8fafc",

              width:
                "fit-content",
            }}
          >
            <TaskActivityTabButton
              active={
                activeTab ===
                "ACTIVITY"
              }
              label="Activity"
              onClick={() =>
                setActiveTab(
                  "ACTIVITY",
                )
              }
            />


            <TaskActivityTabButton
              active={
                activeTab ===
                "WORK_LOG"
              }
              label="Work Log"
              onClick={() =>
                setActiveTab(
                  "WORK_LOG",
                )
              }
            />
          </div>


          {/* =====================================================
              ACTIVITY TAB
              ===================================================== */}

          {activeTab ===
            "ACTIVITY" && (
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


              {activityItems.length ===
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
                  {activityItems.map(
                    (
                      item,
                    ) => {
                      if (
                        item.kind ===
                        "REPORT"
                      ) {
                        return (
                          <ReportActivityItem
                            key={
                              item.key
                            }
                            projectUuid={
                              projectUuid
                            }
                            taskUuid={
                              activityTask.uuid
                            }
                            report={
                              item.report
                            }
                          />
                        );
                      }


                      return (
                        <CompletionReviewActivityItem
                          key={
                            item.key
                          }
                          completionRequest={
                            item.completionRequest
                          }
                        />
                      );
                    },
                  )}
                </div>
              )}
            </section>
          )}


          {/* =====================================================
              WORK LOG TAB
              ===================================================== */}

          {activeTab ===
            "WORK_LOG" && (
            <TaskWorkLog
              summary={
                workSummary
              }
              loading={
                workSummaryLoading
              }
              fetching={
                workSummaryFetching
              }
              error={
                workSummaryError
              }
              onRetry={() => {
                void refetchWorkSummary();
              }}
            />
          )}


          {/* =====================================================
              FOOTER
              ===================================================== */}

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
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


/*
 * =========================================================
 * TAB BUTTON
 * =========================================================
 */
const TaskActivityTabButton = ({
  active,
  label,
  onClick,
}: {
  active:
    boolean;

  label:
    string;

  onClick:
    () => void;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={
      active
    }
    onClick={
      onClick
    }
    style={{
      padding:
        "7px 14px",

      border:
        active
          ? "1px solid #d1d5db"
          : "1px solid transparent",

      borderRadius:
        7,

      background:
        active
          ? "#ffffff"
          : "transparent",

      color:
        active
          ? "#111827"
          : "#6b7280",

      fontSize:
        12,

      fontWeight:
        active
          ? 600
          : 500,

      cursor:
        "pointer",

      boxShadow:
        active
          ? "0 1px 2px rgba(0, 0, 0, 0.04)"
          : "none",
    }}
  >
    {label}
  </button>
);


/*
 * =========================================================
 * TASK WORK LOG
 * =========================================================
 *
 * Manager / Company Admin view.
 *
 * Does NOT display:
 *
 * - punchInAt
 * - punchOutAt
 * - exact start time
 * - exact end time
 *
 * Displays only aggregate duration.
 */
const TaskWorkLog = ({
  summary,
  loading,
  fetching,
  error,
  onRetry,
}: {
  summary:
    ProjectTaskWorkSummary | undefined;

  loading:
    boolean;

  fetching:
    boolean;

  error:
    boolean;

  onRetry:
    () => void;
}) => {
  if (
    loading &&
    !summary
  ) {
    return (
      <section>
        <WorkLogSectionTitle />


        <div
          style={{
            padding:
              "32px 16px",

            border:
              "1px solid #e5e7eb",

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
          Loading work log...
        </div>
      </section>
    );
  }


  if (
    error &&
    !summary
  ) {
    return (
      <section>
        <WorkLogSectionTitle />


        <div
          style={{
            padding:
              "28px 16px",

            border:
              "1px solid #fecaca",

            borderRadius:
              10,

            background:
              "#fef2f2",

            textAlign:
              "center",
          }}
        >
          <div
            style={{
              color:
                "#991b1b",

              fontSize:
                13,

              fontWeight:
                600,
            }}
          >
            Unable to load work log.
          </div>


          <div
            style={{
              marginTop:
                6,

              color:
                "#6b7280",

              fontSize:
                12,
            }}
          >
            Please retry the request.
          </div>


          <div
            style={{
              marginTop:
                12,
            }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={
                onRetry
              }
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }


  if (
    !summary
  ) {
    return null;
  }


  return (
    <section>
      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            12,

          flexWrap:
            "wrap",

          marginBottom:
            12,
        }}
      >
        <WorkLogSectionTitle />


        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              10,
          }}
        >
          {summary
            .isCurrentlyWorking && (
            <span
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap:
                  6,

                padding:
                  "5px 9px",

                borderRadius:
                  999,

                background:
                  "#f0fdf4",

                color:
                  "#15803d",

                fontSize:
                  11,

                fontWeight:
                  700,
              }}
            >
              <span
                style={{
                  width:
                    7,

                  height:
                    7,

                  borderRadius:
                    "50%",

                  background:
                    "#16a34a",
                }}
              />

              Working now
            </span>
          )}


          {fetching &&
            !loading && (
            <span
              style={{
                color:
                  "#9ca3af",

                fontSize:
                  11,
              }}
            >
              Updating...
            </span>
          )}
        </div>
      </div>


      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",

          gap:
            10,
        }}
      >
        <WorkSummaryCard
          label="Total Worked"
          value={
            formatWorkedDuration(
              summary
                .totalWorkedSeconds,
            )
          }
        />


        <WorkSummaryCard
          label="Today"
          value={
            formatWorkedDuration(
              summary
                .todayWorkedSeconds,
            )
          }
        />


        <WorkSummaryCard
          label="Sessions"
          value={
            String(
              summary.sessionCount,
            )
          }
        />
      </div>


      {/* =====================================================
          DATE-WISE WORK
          ===================================================== */}

      <div
        style={{
          marginTop:
            18,
        }}
      >
        <div
          style={{
            marginBottom:
              8,

            color:
              "#374151",

            fontSize:
              12,

            fontWeight:
              600,
          }}
        >
          Work by Date
        </div>


        {summary.dailyWork.length ===
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
            No work time has been logged for this task yet.
          </div>
        ) : (
          <div
            style={{
              overflow:
                "hidden",

              border:
                "1px solid #e5e7eb",

              borderRadius:
                10,

              background:
                "#ffffff",
            }}
          >
            {summary.dailyWork.map(
              (
                item,
                index,
              ) => (
                <div
                  key={
                    item.date
                  }
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    gap:
                      16,

                    padding:
                      "12px 14px",

                    borderBottom:
                      index <
                      summary
                        .dailyWork
                        .length -
                        1
                        ? "1px solid #f3f4f6"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      color:
                        "#374151",

                      fontSize:
                        13,

                      fontWeight:
                        500,
                    }}
                  >
                    {formatWorkDate(
                      item.date,
                    )}
                  </span>


                  <span
                    style={{
                      color:
                        "#111827",

                      fontSize:
                        13,

                      fontWeight:
                        700,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatWorkedDuration(
                      item.workedSeconds,
                    )}
                  </span>
                </div>
              ),
            )}


            {/* TOTAL */}

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  16,

                padding:
                  "13px 14px",

                borderTop:
                  "1px solid #d1d5db",

                background:
                  "#f8fafc",
              }}
            >
              <span
                style={{
                  color:
                    "#111827",

                  fontSize:
                    13,

                  fontWeight:
                    700,
                }}
              >
                Total
              </span>


              <span
                style={{
                  color:
                    "#111827",

                  fontSize:
                    14,

                  fontWeight:
                    700,
                }}
              >
                {formatWorkedDuration(
                  summary
                    .totalWorkedSeconds,
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


/*
 * =========================================================
 * WORK LOG TITLE
 * =========================================================
 */
const WorkLogSectionTitle =
  () => (
    <div
      style={{
        color:
          "#111827",

        fontSize:
          14,

        fontWeight:
          600,
      }}
    >
      Work Log
    </div>
  );


/*
 * =========================================================
 * SUMMARY CARD
 * =========================================================
 */
const WorkSummaryCard = ({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) => (
  <div
    style={{
      padding:
        "14px",

      border:
        "1px solid #e5e7eb",

      borderRadius:
        10,

      background:
        "#f8fafc",

      minWidth:
        0,
    }}
  >
    <div
      style={{
        color:
          "#6b7280",

        fontSize:
          11,

        fontWeight:
          500,
      }}
    >
      {label}
    </div>


    <div
      style={{
        marginTop:
          5,

        color:
          "#111827",

        fontSize:
          20,

        fontWeight:
          700,

        lineHeight:
          1.2,
      }}
    >
      {value}
    </div>
  </div>
);


/*
 * =========================================================
 * DURATION FORMAT
 * =========================================================
 *
 * Manager-facing duration:
 *
 * 12000 -> 3h 20m
 * 3600  -> 1h
 * 1800  -> 30m
 */
const formatWorkedDuration = (
  totalSeconds:
    number,
) => {
  const seconds =
    Math.max(
      0,

      Math.floor(
        Number(
          totalSeconds,
        ) ||
        0,
      ),
    );


  if (
    seconds ===
    0
  ) {
    return "0m";
  }


  if (
    seconds <
    60
  ) {
    return "<1m";
  }


  const hours =
    Math.floor(
      seconds /
        3600,
    );


  const minutes =
    Math.floor(
      (
        seconds %
        3600
      ) /
        60,
    );


  if (
    hours >
      0 &&
    minutes >
      0
  ) {
    return `${hours}h ${minutes}m`;
  }


  if (
    hours >
    0
  ) {
    return `${hours}h`;
  }


  return `${minutes}m`;
};


/*
 * =========================================================
 * BUSINESS DATE FORMAT
 * =========================================================
 *
 * Backend gives:
 *
 * 2026-08-19
 *
 * We intentionally parse year/month/day
 * ourselves to avoid browser UTC timezone
 * shifting the date.
 */
const formatWorkDate = (
  value:
    string,
) => {
  const [
    year,
    month,
    day,
  ] =
    value
      .split("-")
      .map(
        Number,
      );


  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }


  const date =
    new Date(
      year,
      month -
        1,
      day,
    );


  return new Intl.DateTimeFormat(
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
    date,
  );
};


export default ProjectTaskActivityModal;