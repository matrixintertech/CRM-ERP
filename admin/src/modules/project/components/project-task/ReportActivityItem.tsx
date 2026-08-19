import ActivityLabel from "./ActivityLabel";
import ActivityTimelineCard from "./ActivityTimelineCard";
import EvidenceGallery from "./EvidenceGallery";

import {
  formatDateTime,
  getReportConfig,
} from "./project-task-activity.utils";

import type {
  ActivityReport,
} from "./project-task-activity.types";


interface Props {
  projectUuid: string;
  taskUuid: string;
  report: ActivityReport;
}


const ReportActivityItem = ({
  projectUuid,
  taskUuid,
  report,
}: Props) => {
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
      .filter(Boolean)
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
      (attachment) =>
        attachment.type ===
        "IMAGE",
    );


  return (
    <ActivityTimelineCard
      color={config.color}
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

            flexWrap:
              "wrap",
          }}
        >
          <ActivityLabel
            label={config.label}
            color={config.color}
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

            {String(
              report
                .taskStatusSnapshot,
            ).replace(
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
          {formatDateTime(
            report.createdAt,
          )}
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
        {report.message}
      </div>


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
        {employeeName}

        {projectRole && (
          <>
            {" · "}

            {projectRole}
          </>
        )}
      </div>
    </ActivityTimelineCard>
  );
};


export default ReportActivityItem;