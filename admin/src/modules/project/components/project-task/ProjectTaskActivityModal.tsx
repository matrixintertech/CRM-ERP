import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import {
  getProjectTaskReportAttachmentViewUrl,
} from "../../api/project-task.api";

import type {
  ProjectTask,
} from "../../types/project-task.types";


const VISIBLE_EVIDENCE_COUNT =
  3;


/*
 * Backend signed URL expires
 * after 300 seconds.
 *
 * Keep frontend cache slightly
 * shorter than URL lifetime.
 */
const SIGNED_URL_STALE_TIME =
  4 * 60 * 1000;

const SIGNED_URL_GC_TIME =
  5 * 60 * 1000;


type ActivityReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE"
  | "COMPLETION";


type ActivityCompletionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";


interface ActivityAttachment {
  uuid:
    string;

  type:
    | "IMAGE"
    | "DOCUMENT";

  originalName:
    string;

  mimeType:
    string;

  sizeBytes:
    string | number;

  storageKey:
    string;

  createdAt:
    string;
}


interface ActivityReport {
  uuid:
    string;

  type:
    ActivityReportType;

  message:
    string;

  taskStatusSnapshot:
    string;

  createdAt:
    string;

  attachments?:
    ActivityAttachment[];

  projectMember?: {
    uuid:
      string;

    employee?: {
      uuid:
        string;

      displayName?:
        string | null;

      firstName?:
        string | null;

      lastName?:
        string | null;
    } | null;

    projectRole?: {
      uuid:
        string;

      name:
        string;

      code:
        string;
    } | null;
  } | null;
}


interface ActivityCompletionRequest {
  uuid:
    string;

  status:
    ActivityCompletionStatus;

  workedSeconds?:
    number;

  requestedAt:
    string;

  reviewedAt?:
    string | null;

  reviewNote?:
    string | null;

  reviewedByUser?: {
    uuid:
      string;
  } | null;

  report?: {
    uuid:
      string;

    type:
      ActivityReportType;

    message:
      string;

    taskStatusSnapshot:
      string;

    createdAt:
      string;
  } | null;
}


type ProjectTaskWithActivity =
  ProjectTask & {
    reports?:
      ActivityReport[];

    completionRequests?:
      ActivityCompletionRequest[];

    _count?: {
      reports:
        number;
    };
  };


type TimelineItem =
  | {
      kind:
        "REPORT";

      key:
        string;

      occurredAt:
        string;

      report:
        ActivityReport;
    }
  | {
      kind:
        "COMPLETION_REVIEW";

      key:
        string;

      occurredAt:
        string;

      completionRequest:
        ActivityCompletionRequest;
    };


interface Props {
  open:
    boolean;

  projectUuid:
    string;

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
          {/*
           * =================================================
           * TASK HEADER
           * =================================================
           */}
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
                activityTask.title
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
                  String(
                    activityTask.status,
                  ).replace(
                    /_/g,
                    " ",
                  )
                }
              />


              <InfoBadge
                label="Priority"
                value={
                  String(
                    activityTask.priority,
                  )
                }
              />


              <InfoBadge
                label="Activity"
                value={
                  String(
                    activityItems.length,
                  )
                }
              />
            </div>
          </section>


          {/*
           * =================================================
           * ACTIVITY TIMELINE
           * =================================================
           */}
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


          {/*
           * =================================================
           * FOOTER
           * =================================================
           */}
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


/*
 * =========================================================
 * REPORT ACTIVITY
 * =========================================================
 */
const ReportActivityItem = ({
  projectUuid,
  taskUuid,
  report,
}: {
  projectUuid:
    string;

  taskUuid:
    string;

  report:
    ActivityReport;
}) => {
  const config =
    getReportConfig(
      report.type,
    );


  const employeeName =
    report.projectMember
      ?.employee
      ?.displayName
      ?.trim() ||
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
      .join(
        " ",
      ) ||
    "Employee";


  const projectRole =
    report.projectMember
      ?.projectRole
      ?.name;


  const imageAttachments =
    (
      report.attachments ??
      []
    ).filter(
      (
        attachment,
      ) =>
        attachment.type ===
        "IMAGE",
    );


  return (
    <TimelineCard
      color={
        config.color
      }
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
          <ActivityLabel
            label={
              config.label
            }
            color={
              config.color
            }
            background={
              config.background
            }
          />


          <span
            style={{
              color:
                "#6b7280",

              fontSize:
                11,
            }}
          >
            Status:{" "}

            {
              String(
                report
                  .taskStatusSnapshot,
              ).replace(
                /_/g,
                " ",
              )
            }
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


      {/*
       * =====================================================
       * EVIDENCE GALLERY
       * =====================================================
       */}
      {imageAttachments.length >
        0 && (
        <EvidenceGallery
          projectUuid={
            projectUuid
          }
          taskUuid={
            taskUuid
          }
          attachments={
            imageAttachments
          }
        />
      )}


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
        {
          employeeName
        }


        {projectRole && (
          <>
            {" · "}

            {
              projectRole
            }
          </>
        )}
      </div>
    </TimelineCard>
  );
};


/*
 * =========================================================
 * MANAGER REVIEW ACTIVITY
 * =========================================================
 */
const CompletionReviewActivityItem = ({
  completionRequest,
}: {
  completionRequest:
    ActivityCompletionRequest;
}) => {
  const approved =
    completionRequest.status ===
    "APPROVED";


  const label =
    approved
      ? "APPROVED"
      : "CHANGES REQUESTED";


  const color =
    approved
      ? "#15803d"
      : "#c2410c";


  const background =
    approved
      ? "#f0fdf4"
      : "#fff7ed";


  const resultStatus =
    approved
      ? "COMPLETED"
      : "IN PROGRESS";


  const message =
    completionRequest
      .reviewNote
      ?.trim() ||
    (
      approved
        ? "Task completion was approved."
        : "Changes were requested before task completion can be approved."
    );


  if (
    !completionRequest.reviewedAt
  ) {
    return null;
  }


  return (
    <TimelineCard
      color={
        color
      }
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
          <ActivityLabel
            label={
              label
            }
            color={
              color
            }
            background={
              background
            }
          />


          <span
            style={{
              color:
                "#6b7280",

              fontSize:
                11,
            }}
          >
            Result:{" "}

            {
              resultStatus
            }
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
              completionRequest
                .reviewedAt,
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
          message
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
        Manager review

        {" · "}

        Completion request
      </div>
    </TimelineCard>
  );
};


/*
 * =========================================================
 * EVIDENCE GALLERY
 * =========================================================
 *
 * 1 image  -> one tile
 * 2 images -> two tiles
 * 3 images -> three tiles
 * 4+       -> first three + overlay
 */
const EvidenceGallery = ({
  projectUuid,
  taskUuid,
  attachments,
}: {
  projectUuid:
    string;

  taskUuid:
    string;

  attachments:
    ActivityAttachment[];
}) => {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState<
      number | null
    >(
      null,
    );


  const visibleAttachments =
    attachments.slice(
      0,
      VISIBLE_EVIDENCE_COUNT,
    );


  const hiddenCount =
    Math.max(
      0,

      attachments.length -
        VISIBLE_EVIDENCE_COUNT,
    );


  const galleryMaxWidth =
    visibleAttachments.length ===
    1
      ? 180
      : visibleAttachments.length ===
          2
        ? 360
        : 520;


  return (
    <>
      <div
        style={{
          marginTop:
            14,
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              8,

            marginBottom:
              8,
          }}
        >
          <div
            style={{
              color:
                "#374151",

              fontSize:
                12,

              fontWeight:
                600,
            }}
          >
            Evidence
          </div>


          <div
            style={{
              color:
                "#9ca3af",

              fontSize:
                10,
            }}
          >
            {
              attachments.length
            }{" "}
            {
              attachments.length ===
              1
                ? "image"
                : "images"
            }
          </div>
        </div>


        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              `repeat(${visibleAttachments.length}, minmax(0, 1fr))`,

            gap:
              8,

            width:
              "100%",

            maxWidth:
              galleryMaxWidth,
          }}
        >
          {visibleAttachments.map(
            (
              attachment,
              index,
            ) => {
              const showMore =
                index ===
                  VISIBLE_EVIDENCE_COUNT -
                    1 &&
                hiddenCount >
                  0;


              return (
                <EvidenceThumbnail
                  key={
                    attachment.uuid
                  }
                  projectUuid={
                    projectUuid
                  }
                  taskUuid={
                    taskUuid
                  }
                  attachment={
                    attachment
                  }
                  extraCount={
                    showMore
                      ? hiddenCount
                      : 0
                  }
                  onOpen={() =>
                    setActiveIndex(
                      index,
                    )
                  }
                />
              );
            },
          )}
        </div>
      </div>


      {activeIndex !==
        null && (
        <EvidenceLightbox
          projectUuid={
            projectUuid
          }
          taskUuid={
            taskUuid
          }
          attachments={
            attachments
          }
          index={
            activeIndex
          }
          onIndexChange={
            setActiveIndex
          }
          onClose={() =>
            setActiveIndex(
              null,
            )
          }
        />
      )}
    </>
  );
};


/*
 * =========================================================
 * EVIDENCE THUMBNAIL
 * =========================================================
 */
const EvidenceThumbnail = ({
  projectUuid,
  taskUuid,
  attachment,
  extraCount,
  onOpen,
}: {
  projectUuid:
    string;

  taskUuid:
    string;

  attachment:
    ActivityAttachment;

  extraCount:
    number;

  onOpen:
    () => void;
}) => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } =
    useSignedAttachmentUrl(
      projectUuid,
      taskUuid,
      attachment.uuid,
    );


  const [
    imageFailed,
    setImageFailed,
  ] =
    useState(
      false,
    );


  useEffect(
    () => {
      setImageFailed(
        false,
      );
    },
    [
      data?.url,
    ],
  );


  const failed =
    isError ||
    imageFailed;


  const handleRetry =
    () => {
      setImageFailed(
        false,
      );

      void refetch();
    };


  return (
    <div
      style={{
        position:
          "relative",

        overflow:
          "hidden",

        minWidth:
          0,

        aspectRatio:
          "4 / 3",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          8,

        background:
          "#f3f4f6",
      }}
    >
      {isLoading &&
      !data ? (
        <EvidenceSkeleton />
      ) : failed ||
        !data?.url ? (
        <div
          style={{
            width:
              "100%",

            height:
              "100%",

            boxSizing:
              "border-box",

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              6,

            padding:
              8,

            color:
              "#6b7280",

            textAlign:
              "center",

            fontSize:
              10,
          }}
        >
          <span>
            Image unavailable
          </span>


          <button
            type="button"
            disabled={
              isFetching
            }
            onClick={
              handleRetry
            }
            style={{
              padding:
                "4px 7px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                5,

              background:
                "#ffffff",

              color:
                "#374151",

              cursor:
                isFetching
                  ? "wait"
                  : "pointer",

              fontSize:
                10,
            }}
          >
            {
              isFetching
                ? "Retrying..."
                : "Retry"
            }
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={
            onOpen
          }
          aria-label={`View ${attachment.originalName}`}
          style={{
            position:
              "relative",

            display:
              "block",

            width:
              "100%",

            height:
              "100%",

            padding:
              0,

            border:
              "none",

            background:
              "transparent",

            cursor:
              "pointer",
          }}
        >
          <img
            src={
              data.url
            }
            alt={
              attachment.originalName
            }
            loading="lazy"
            onError={() =>
              setImageFailed(
                true,
              )
            }
            style={{
              display:
                "block",

              width:
                "100%",

              height:
                "100%",

              objectFit:
                "cover",
            }}
          />


          <div
            style={{
              position:
                "absolute",

              right:
                0,

              bottom:
                0,

              left:
                0,

              padding:
                "18px 7px 6px",

              background:
                "linear-gradient(transparent, rgba(17, 24, 39, 0.72))",

              color:
                "#ffffff",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",

              textAlign:
                "left",

              fontSize:
                9,

              pointerEvents:
                "none",
            }}
          >
            {
              attachment.originalName
            }
          </div>


          {extraCount >
            0 && (
            <div
              style={{
                position:
                  "absolute",

                inset:
                  0,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "rgba(17, 24, 39, 0.55)",

                color:
                  "#ffffff",

                fontSize:
                  22,

                fontWeight:
                  700,

                pointerEvents:
                  "none",
              }}
            >
              +{
                extraCount
              }
            </div>
          )}
        </button>
      )}
    </div>
  );
};


/*
 * =========================================================
 * EVIDENCE LIGHTBOX
 * =========================================================
 */
const EvidenceLightbox = ({
  projectUuid,
  taskUuid,
  attachments,
  index,
  onIndexChange,
  onClose,
}: {
  projectUuid:
    string;

  taskUuid:
    string;

  attachments:
    ActivityAttachment[];

  index:
    number;

  onIndexChange:
    (
      index:
        number,
    ) => void;

  onClose:
    () => void;
}) => {
  const attachment =
    attachments[
      index
    ];


  const queryClient =
    useQueryClient();


  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } =
    useSignedAttachmentUrl(
      projectUuid,
      taskUuid,
      attachment.uuid,
    );


  const [
    imageFailed,
    setImageFailed,
  ] =
    useState(
      false,
    );


  const hasPrevious =
    index >
    0;


  const hasNext =
    index <
    attachments.length -
      1;


  /*
   * Reset current image error
   * when image changes.
   */
  useEffect(
    () => {
      setImageFailed(
        false,
      );
    },
    [
      attachment.uuid,
      data?.url,
    ],
  );


  /*
   * Prefetch previous / next
   * signed URLs.
   */
  useEffect(
    () => {
      const adjacentIndexes =
        [
          index -
            1,

          index +
            1,
        ];


      adjacentIndexes.forEach(
        (
          adjacentIndex,
        ) => {
          const adjacentAttachment =
            attachments[
              adjacentIndex
            ];


          if (
            !adjacentAttachment
          ) {
            return;
          }


          void queryClient
            .prefetchQuery({
              queryKey:
                getAttachmentQueryKey(
                  projectUuid,
                  taskUuid,
                  adjacentAttachment.uuid,
                ),

              queryFn:
                () =>
                  getProjectTaskReportAttachmentViewUrl(
                    projectUuid,
                    taskUuid,
                    adjacentAttachment.uuid,
                  ),

              staleTime:
                SIGNED_URL_STALE_TIME,

              gcTime:
                SIGNED_URL_GC_TIME,
            });
        },
      );
    },
    [
      queryClient,
      projectUuid,
      taskUuid,
      attachments,
      index,
    ],
  );


  /*
   * Keyboard navigation.
   */
  useEffect(
    () => {
      const handleKeyDown = (
        event:
          KeyboardEvent,
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          onClose();

          return;
        }


        if (
          event.key ===
            "ArrowLeft" &&
          hasPrevious
        ) {
          onIndexChange(
            index -
              1,
          );

          return;
        }


        if (
          event.key ===
            "ArrowRight" &&
          hasNext
        ) {
          onIndexChange(
            index +
              1,
          );
        }
      };


      window.addEventListener(
        "keydown",
        handleKeyDown,
      );


      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [
      index,
      hasPrevious,
      hasNext,
      onIndexChange,
      onClose,
    ],
  );


  /*
   * Prevent body scroll while
   * lightbox is open.
   */
  useEffect(
    () => {
      const previousOverflow =
        document.body.style
          .overflow;


      document.body.style
        .overflow =
        "hidden";


      return () => {
        document.body.style
          .overflow =
          previousOverflow;
      };
    },
    [],
  );


  const handleRetry =
    () => {
      setImageFailed(
        false,
      );

      void refetch();
    };


  const failed =
    isError ||
    imageFailed;


  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }


  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence image preview"
      style={{
        position:
          "fixed",

        inset:
          0,

        zIndex:
          10000,

        display:
          "grid",

        gridTemplateRows:
          "auto minmax(0, 1fr) auto",

        background:
          "rgba(3, 7, 18, 0.95)",
      }}
    >
      {/* Header */}

      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            16,

          padding:
            "14px 18px",

          borderBottom:
            "1px solid rgba(255,255,255,0.12)",

          color:
            "#ffffff",
        }}
      >
        <div
          style={{
            minWidth:
              0,
          }}
        >
          <div
            title={
              attachment.originalName
            }
            style={{
              maxWidth:
                "70vw",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",

              fontSize:
                14,

              fontWeight:
                600,
            }}
          >
            {
              attachment.originalName
            }
          </div>


          <div
            style={{
              marginTop:
                3,

              color:
                "#9ca3af",

              fontSize:
                11,
            }}
          >
            Image {
              index +
              1
            } of {
              attachments.length
            }
          </div>
        </div>


        <button
          type="button"
          aria-label="Close image viewer"
          onClick={
            onClose
          }
          style={{
            width:
              38,

            height:
              38,

            flexShrink:
              0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            border:
              "1px solid rgba(255,255,255,0.18)",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,0.08)",

            color:
              "#ffffff",

            cursor:
              "pointer",

            fontSize:
              24,

            lineHeight:
              1,
          }}
        >
          ×
        </button>
      </div>


      {/* Main Image */}

      <div
        onMouseDown={(
          event,
        ) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }}
        style={{
          position:
            "relative",

          minHeight:
            0,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            "20px 64px",
        }}
      >
        {/* Previous */}

        {hasPrevious && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() =>
              onIndexChange(
                index -
                  1,
              )
            }
            style={{
              position:
                "absolute",

              top:
                "50%",

              left:
                14,

              transform:
                "translateY(-50%)",

              width:
                42,

              height:
                42,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              border:
                "1px solid rgba(255,255,255,0.18)",

              borderRadius:
                "50%",

              background:
                "rgba(255,255,255,0.08)",

              color:
                "#ffffff",

              cursor:
                "pointer",

              fontSize:
                30,

              lineHeight:
                1,
            }}
          >
            ‹
          </button>
        )}


        {isLoading &&
        !data ? (
          <div
            style={{
              width:
                "min(760px, 80vw)",

              height:
                "min(520px, 65vh)",

              borderRadius:
                10,

              background:
                "rgba(255,255,255,0.08)",
            }}
          />
        ) : failed ||
          !data?.url ? (
          <div
            style={{
              width:
                "min(420px, 80vw)",

              padding:
                "32px 20px",

              border:
                "1px solid rgba(255,255,255,0.14)",

              borderRadius:
                10,

              background:
                "rgba(255,255,255,0.06)",

              color:
                "#ffffff",

              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize:
                  14,

                fontWeight:
                  600,
              }}
            >
              Unable to load image
            </div>


            <div
              style={{
                marginTop:
                  6,

                color:
                  "#9ca3af",

                fontSize:
                  12,
              }}
            >
              The temporary image URL may have expired or the request failed.
            </div>


            <button
              type="button"
              disabled={
                isFetching
              }
              onClick={
                handleRetry
              }
              style={{
                marginTop:
                  14,

                padding:
                  "8px 12px",

                border:
                  "1px solid rgba(255,255,255,0.2)",

                borderRadius:
                  7,

                background:
                  "rgba(255,255,255,0.1)",

                color:
                  "#ffffff",

                cursor:
                  isFetching
                    ? "wait"
                    : "pointer",

                fontSize:
                  12,
              }}
            >
              {
                isFetching
                  ? "Retrying..."
                  : "Retry"
              }
            </button>
          </div>
        ) : (
          <img
            src={
              data.url
            }
            alt={
              attachment.originalName
            }
            onError={() =>
              setImageFailed(
                true,
              )
            }
            style={{
              display:
                "block",

              maxWidth:
                "100%",

              maxHeight:
                "100%",

              width:
                "auto",

              height:
                "auto",

              objectFit:
                "contain",

              borderRadius:
                8,

              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35)",
            }}
          />
        )}


        {/* Next */}

        {hasNext && (
          <button
            type="button"
            aria-label="Next image"
            onClick={() =>
              onIndexChange(
                index +
                  1,
              )
            }
            style={{
              position:
                "absolute",

              top:
                "50%",

              right:
                14,

              transform:
                "translateY(-50%)",

              width:
                42,

              height:
                42,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              border:
                "1px solid rgba(255,255,255,0.18)",

              borderRadius:
                "50%",

              background:
                "rgba(255,255,255,0.08)",

              color:
                "#ffffff",

              cursor:
                "pointer",

              fontSize:
                30,

              lineHeight:
                1,
            }}
          >
            ›
          </button>
        )}
      </div>


      {/* Footer */}

      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            16,

          padding:
            "11px 18px",

          borderTop:
            "1px solid rgba(255,255,255,0.12)",

          color:
            "#9ca3af",

          fontSize:
            11,
        }}
      >
        <div>
          {
            attachment.mimeType
          }

          {" · "}

          {
            formatFileSize(
              Number(
                attachment.sizeBytes,
              ),
            )
          }
        </div>


        <div>
          {
            index +
            1
          }

          {" / "}

          {
            attachments.length
          }
        </div>
      </div>
    </div>,

    document.body,
  );
};


/*
 * =========================================================
 * SIGNED ATTACHMENT URL QUERY
 * =========================================================
 */
const useSignedAttachmentUrl = (
  projectUuid:
    string,

  taskUuid:
    string,

  attachmentUuid:
    string,
) => {
  return useQuery({
    queryKey:
      getAttachmentQueryKey(
        projectUuid,
        taskUuid,
        attachmentUuid,
      ),

    queryFn:
      () =>
        getProjectTaskReportAttachmentViewUrl(
          projectUuid,
          taskUuid,
          attachmentUuid,
        ),

    staleTime:
      SIGNED_URL_STALE_TIME,

    gcTime:
      SIGNED_URL_GC_TIME,

    retry:
      1,

    refetchOnWindowFocus:
      true,
  });
};


const getAttachmentQueryKey = (
  projectUuid:
    string,

  taskUuid:
    string,

  attachmentUuid:
    string,
) =>
  [
    "project-task-report-attachment-view-url",
    projectUuid,
    taskUuid,
    attachmentUuid,
  ] as const;


/*
 * =========================================================
 * EVIDENCE SKELETON
 * =========================================================
 */
const EvidenceSkeleton =
  () => (
    <div
      aria-label="Loading image"
      style={{
        width:
          "100%",

        height:
          "100%",

        background:
          "linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%)",

        backgroundSize:
          "200% 100%",
      }}
    />
  );


/*
 * =========================================================
 * TIMELINE CARD
 * =========================================================
 */
const TimelineCard = ({
  color,
  children,
}: {
  color:
    string;

  children:
    ReactNode;
}) => (
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
            color,

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
      {
        children
      }
    </div>
  </article>
);


/*
 * =========================================================
 * LABEL
 * =========================================================
 */
const ActivityLabel = ({
  label,
  color,
  background,
}: {
  label:
    string;

  color:
    string;

  background:
    string;
}) => (
  <span
    style={{
      padding:
        "4px 8px",

      borderRadius:
        999,

      background,

      color,

      fontSize:
        11,

      fontWeight:
        700,
    }}
  >
    {
      label
    }
  </span>
);


/*
 * =========================================================
 * INFO BADGE
 * =========================================================
 */
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
      {
        label
      }:
    </strong>

    {" "}

    {
      value
    }
  </span>
);


/*
 * =========================================================
 * BUILD ACTIVITY TIMELINE
 * =========================================================
 *
 * Employee:
 * reports[]
 *
 * Manager:
 * reviewed completionRequests[]
 *
 * PENDING completion request ko
 * duplicate event nahi banate because
 * COMPLETION report already reports[]
 * me present hota hai.
 */
const buildActivityTimeline = (
  task:
    ProjectTaskWithActivity,
): TimelineItem[] => {
  const reportItems:
    TimelineItem[] =
    (
      task.reports ??
      []
    ).map(
      (
        report,
      ) => ({
        kind:
          "REPORT" as const,

        key:
          `report:${report.uuid}`,

        occurredAt:
          report.createdAt,

        report,
      }),
    );


  const reviewItems:
    TimelineItem[] =
    (
      task.completionRequests ??
      []
    )
      .filter(
        (
          completionRequest,
        ) =>
          (
            completionRequest.status ===
              "APPROVED" ||
            completionRequest.status ===
              "REJECTED"
          ) &&
          Boolean(
            completionRequest
              .reviewedAt,
          ),
      )
      .map(
        (
          completionRequest,
        ) => ({
          kind:
            "COMPLETION_REVIEW" as const,

          key:
            `completion-review:${completionRequest.uuid}`,

          occurredAt:
            completionRequest
              .reviewedAt!,

          completionRequest,
        }),
      );


  return [
    ...reportItems,
    ...reviewItems,
  ].sort(
    (
      first,
      second,
    ) =>
      new Date(
        second.occurredAt,
      ).getTime() -
      new Date(
        first.occurredAt,
      ).getTime(),
  );
};


/*
 * =========================================================
 * REPORT CONFIG
 * =========================================================
 */
const getReportConfig = (
  type:
    ActivityReportType,
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


/*
 * =========================================================
 * DATE FORMAT
 * =========================================================
 */
const formatDateTime = (
  value:
    string,
) => {
  const date =
    new Date(
      value,
    );


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }


  return new Intl.DateTimeFormat(
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
    date,
  );
};


/*
 * =========================================================
 * FILE SIZE
 * =========================================================
 */
const formatFileSize = (
  bytes:
    number,
) => {
  if (
    !Number.isFinite(
      bytes,
    ) ||
    bytes <
      0
  ) {
    return "Unknown size";
  }


  if (
    bytes <
    1024
  ) {
    return `${bytes} B`;
  }


  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes /
      1024
    ).toFixed(
      1,
    )} KB`;
  }


  return `${(
    bytes /
    (
      1024 *
      1024
    )
  ).toFixed(
    1,
  )} MB`;
};


export default ProjectTaskActivityModal;