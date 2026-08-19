import type {
  ActivityReportType,
  ProjectTaskWithActivity,
  TimelineItem,
} from "./project-task-activity.types";


export const buildActivityTimeline = (
  task: ProjectTaskWithActivity,
): TimelineItem[] => {
  const reportItems: TimelineItem[] =
    (task.reports ?? []).map(
      (report) => ({
        kind: "REPORT",
        key: `report:${report.uuid}`,
        occurredAt: report.createdAt,
        report,
      }),
    );


  const reviewItems: TimelineItem[] =
    (task.completionRequests ?? [])
      .filter(
        (completionRequest) =>
          (
            completionRequest.status ===
              "APPROVED" ||
            completionRequest.status ===
              "REJECTED"
          ) &&
          Boolean(
            completionRequest.reviewedAt,
          ),
      )
      .map(
        (completionRequest) => ({
          kind:
            "COMPLETION_REVIEW",

          key:
            `completion-review:${completionRequest.uuid}`,

          occurredAt:
            completionRequest.reviewedAt as string,

          completionRequest,
        }),
      );


  return [
    ...reportItems,
    ...reviewItems,
  ].sort(
    (first, second) =>
      new Date(
        second.occurredAt,
      ).getTime() -
      new Date(
        first.occurredAt,
      ).getTime(),
  );
};


export const getReportConfig = (
  type: ActivityReportType,
) => {
  switch (type) {
    case "BLOCKER":
      return {
        label: "BLOCKER",
        background: "#fef2f2",
        color: "#b91c1c",
      };

    case "NOTE":
      return {
        label: "NOTE",
        background: "#f3f4f6",
        color: "#374151",
      };

    case "COMPLETION":
      return {
        label: "COMPLETION",
        background: "#f0fdf4",
        color: "#15803d",
      };

    case "PROGRESS":
    default:
      return {
        label: "PROGRESS",
        background: "#eff6ff",
        color: "#1d4ed8",
      };
  }
};


export const formatDateTime = (
  value: string,
) => {
  const date =
    new Date(value);


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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
};


export const formatFileSize = (
  bytes: number,
) => {
  if (
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return "Unknown size";
  }


  if (bytes < 1024) {
    return `${bytes} B`;
  }


  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }


  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};