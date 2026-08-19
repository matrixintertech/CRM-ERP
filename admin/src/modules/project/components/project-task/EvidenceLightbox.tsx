import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProjectTaskReportAttachmentViewUrl,
} from "../../api/project-task.api";

import {
  SIGNED_URL_GC_TIME,
  SIGNED_URL_STALE_TIME,
} from "./project-task-activity.constants";

import {
  formatFileSize,
} from "./project-task-activity.utils";

import {
  getAttachmentQueryKey,
  useSignedAttachmentUrl,
} from "./useSignedAttachmentUrl";

import type {
  ActivityAttachment,
} from "./project-task-activity.types";


interface Props {
  projectUuid: string;

  taskUuid: string;

  attachments:
    ActivityAttachment[];

  index: number;

  onIndexChange: (
    index: number,
  ) => void;

  onClose: () => void;
}


const EvidenceLightbox = ({
  projectUuid,
  taskUuid,
  attachments,
  index,
  onIndexChange,
  onClose,
}: Props) => {
  const attachment =
    attachments[index];


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
  ] = useState(false);


  const hasPrevious =
    index > 0;


  const hasNext =
    index <
    attachments.length - 1;


  /*
   * Reset image error when
   * current image changes.
   */
  useEffect(
    () => {
      setImageFailed(false);
    },
    [
      attachment.uuid,
      data?.url,
    ],
  );


  /*
   * Prefetch previous / next
   * signed image URLs.
   */
  useEffect(
    () => {
      const adjacentIndexes = [
        index - 1,
        index + 1,
      ];


      adjacentIndexes.forEach(
        (adjacentIndex) => {
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

              queryFn: () =>
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
   *
   * Escape     -> close
   * ArrowLeft  -> previous
   * ArrowRight -> next
   */
  useEffect(
    () => {
      const handleKeyDown = (
        event: KeyboardEvent,
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
            index - 1,
          );

          return;
        }


        if (
          event.key ===
            "ArrowRight" &&
          hasNext
        ) {
          onIndexChange(
            index + 1,
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


  const handleRetry = () => {
    setImageFailed(false);

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
        position: "fixed",

        inset: 0,

        zIndex: 10000,

        display: "grid",

        gridTemplateRows:
          "auto minmax(0, 1fr) auto",

        background:
          "rgba(3, 7, 18, 0.95)",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap: 16,

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
            minWidth: 0,
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
            {attachment.originalName}
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
            Image {index + 1} of{" "}
            {attachments.length}
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
                index - 1,
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
              {isFetching
                ? "Retrying..."
                : "Retry"}
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
                index + 1,
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
          {attachment.mimeType}

          {" · "}

          {formatFileSize(
            Number(
              attachment.sizeBytes,
            ),
          )}
        </div>


        <div>
          {index + 1}

          {" / "}

          {attachments.length}
        </div>
      </div>
    </div>,

    document.body,
  );
};


export default EvidenceLightbox;