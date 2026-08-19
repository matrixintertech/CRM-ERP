import {
  useState,
} from "react";

import EvidenceLightbox from "./EvidenceLightbox";
import EvidenceThumbnail from "./EvidenceThumbnail";

import {
  VISIBLE_EVIDENCE_COUNT,
} from "./project-task-activity.constants";

import type {
  ActivityAttachment,
} from "./project-task-activity.types";


interface Props {
  projectUuid: string;
  taskUuid: string;
  attachments:
    ActivityAttachment[];
}


const EvidenceGallery = ({
  projectUuid,
  taskUuid,
  attachments,
}: Props) => {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<
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
    visibleAttachments.length === 1
      ? 180
      : visibleAttachments.length === 2
        ? 360
        : 520;


  return (
    <>
      <div
        style={{
          marginTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 8,

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
            {attachments.length}{" "}

            {attachments.length === 1
              ? "image"
              : "images"}
          </div>
        </div>


        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              `repeat(${visibleAttachments.length}, minmax(0, 1fr))`,

            gap: 8,

            width: "100%",

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
                hiddenCount > 0;


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


      {activeIndex !== null && (
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


export default EvidenceGallery;