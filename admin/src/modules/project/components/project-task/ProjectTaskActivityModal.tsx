import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

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
      open={open}
      title="Task Activity"
      onClose={onClose}
      size="lg"
    >
      {!activityTask ? (
        <div
          style={{
            padding: "12px 0",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          Task information is not available.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <section
            style={{
              padding:
                "14px 16px",
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
              background:
                "#f8fafc",
            }}
          >
            <div
              style={{
                color: "#111827",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {activityTask.title}
            </div>


            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 12,
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


          <section>
            <div
              style={{
                marginBottom: 12,
                color: "#111827",
                fontSize: 14,
                fontWeight: 600,
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
                  borderRadius: 10,
                  color: "#6b7280",
                  textAlign:
                    "center",
                  fontSize: 13,
                }}
              >
                No task activity yet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                {activityItems.map(
                  (item) => {
                    if (
                      item.kind ===
                      "REPORT"
                    ) {
                      return (
                        <ReportActivityItem
                          key={item.key}
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
                        key={item.key}
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


          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              paddingTop: 4,
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


export default ProjectTaskActivityModal;