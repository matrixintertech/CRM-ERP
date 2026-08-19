import {
  useEffect,
  useState,
} from "react";

import EvidenceSkeleton from "./EvidenceSkeleton";

import {
  useSignedAttachmentUrl,
} from "./useSignedAttachmentUrl";

import type {
  ActivityAttachment,
} from "./project-task-activity.types";


interface Props {
  projectUuid: string;
  taskUuid: string;

  attachment:
    ActivityAttachment;

  extraCount: number;

  onOpen:
    () => void;
}


const EvidenceThumbnail = ({
  projectUuid,
  taskUuid,
  attachment,
  extraCount,
  onOpen,
}: Props) => {
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


  useEffect(
    () => {
      setImageFailed(false);
    },
    [
      data?.url,
    ],
  );


  const failed =
    isError ||
    imageFailed;


  const handleRetry = () => {
    setImageFailed(false);

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
            {isFetching
              ? "Retrying..."
              : "Retry"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={
            onOpen
          }
          aria-label={
            `View ${attachment.originalName}`
          }
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
            {attachment.originalName}
          </div>


          {extraCount > 0 && (
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
              +{extraCount}
            </div>
          )}
        </button>
      )}
    </div>
  );
};


export default EvidenceThumbnail;