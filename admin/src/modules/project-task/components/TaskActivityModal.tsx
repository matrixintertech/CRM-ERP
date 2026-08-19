import {
  useEffect,
  useState,
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
  getMyTaskReportAttachmentViewUrl,
} from "../api/my-task.api";

import type {
  MyTask,
  MyTaskReport,
  MyTaskReportAttachment,
  MyTaskReportType,
} from "../types/my-task.types";


const VISIBLE_EVIDENCE_COUNT =
  3;


/*
 * Backend signed URL currently
 * expires after 300 seconds.
 *
 * Keep cache slightly shorter
 * than signed URL lifetime.
 */
const SIGNED_URL_STALE_TIME =
  4 * 60 * 1000;

const SIGNED_URL_GC_TIME =
  5 * 60 * 1000;


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
                      taskUuid={
                        task.uuid
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


/*
 * =========================================================
 * ACTIVITY ITEM
 * =========================================================
 */
const ActivityItem = ({
  taskUuid,
  report,
}: {
  taskUuid:
    string;

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
      {/* Timeline Marker */}

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


      {/* Activity Content */}

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

              {
                report
                  .taskStatusSnapshot
                  .replace(
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


        {/* Report Message */}

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


        {/* Evidence Gallery */}

        {imageAttachments.length >
          0 && (
          <EvidenceGallery
            taskUuid={
              taskUuid
            }
            attachments={
              imageAttachments
            }
          />
        )}


        {/* Employee */}

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
      </div>
    </article>
  );
};


/*
 * =========================================================
 * EVIDENCE GALLERY
 * =========================================================
 *
 * Compact activity timeline gallery:
 *
 * 1 -> one image
 * 2 -> two images
 * 3 -> three images
 * 4+ -> first three with +N overlay
 */
const EvidenceGallery = ({
  taskUuid,
  attachments,
}: {
  taskUuid:
    string;

  attachments:
    MyTaskReportAttachment[];
}) => {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState<
      number | null
    >(null);


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
            }
            {" "}
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
 * THUMBNAIL
 * =========================================================
 */
const EvidenceThumbnail = ({
  taskUuid,
  attachment,
  extraCount,
  onOpen,
}: {
  taskUuid:
    string;

  attachment:
    MyTaskReportAttachment;

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


          {/* Filename */}

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


          {/* +N Overlay */}

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
  taskUuid,
  attachments,
  index,
  onIndexChange,
  onClose,
}: {
  taskUuid:
    string;

  attachments:
    MyTaskReportAttachment[];

  index:
    number;

  onIndexChange:
    (
      index: number,
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
   * Reset image error whenever
   * current image changes.
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
   * Prefetch adjacent signed URLs.
   *
   * User jab Next / Previous kare,
   * transition faster feel hogi.
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
                  taskUuid,
                  adjacentAttachment.uuid,
                ),

              queryFn:
                () =>
                  getMyTaskReportAttachmentViewUrl(
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
   * Stop body scroll while
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
      {/* Lightbox Header */}

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


      {/* Lightbox Footer */}

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
 * SIGNED URL QUERY
 * =========================================================
 */
const useSignedAttachmentUrl = (
  taskUuid:
    string,

  attachmentUuid:
    string,
) => {
  return useQuery({
    queryKey:
      getAttachmentQueryKey(
        taskUuid,
        attachmentUuid,
      ),

    queryFn:
      () =>
        getMyTaskReportAttachmentViewUrl(
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
  taskUuid:
    string,

  attachmentUuid:
    string,
) =>
  [
    "my-task-report-attachment-view-url",
    taskUuid,
    attachmentUuid,
  ] as const;


/*
 * =========================================================
 * SKELETON
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
 * ACTIVITY CONFIG
 * =========================================================
 */
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


/*
 * =========================================================
 * DATE FORMAT
 * =========================================================
 */
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


export default TaskActivityModal;