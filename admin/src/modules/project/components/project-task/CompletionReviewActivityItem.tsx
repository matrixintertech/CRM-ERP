import ActivityLabel from "./ActivityLabel";
import ActivityTimelineCard from "./ActivityTimelineCard";

import {
  formatDateTime,
} from "./project-task-activity.utils";

import type {
  ActivityCompletionRequest,
} from "./project-task-activity.types";


interface Props {
  completionRequest:
    ActivityCompletionRequest;
}


const CompletionReviewActivityItem = ({
  completionRequest,
}: Props) => {
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
    <ActivityTimelineCard
      color={color}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <ActivityLabel
            label={label}
            color={color}
            background={
              background
            }
          />

          <span
            style={{
              color: "#6b7280",
              fontSize: 11,
            }}
          >
            Result:{" "}
            {resultStatus}
          </span>
        </div>

        <span
          style={{
            color: "#6b7280",
            fontSize: 11,
            whiteSpace:
              "nowrap",
          }}
        >
          {formatDateTime(
            completionRequest
              .reviewedAt,
          )}
        </span>
      </div>

      <div
        style={{
          marginTop: 12,
          color: "#374151",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace:
            "pre-wrap",
          overflowWrap:
            "anywhere",
        }}
      >
        {message}
      </div>

      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop:
            "1px solid #f3f4f6",
          color: "#6b7280",
          fontSize: 11,
        }}
      >
        Manager review

        {" · "}

        Completion request
      </div>
    </ActivityTimelineCard>
  );
};


export default CompletionReviewActivityItem;