import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import type {
  ProjectTask,
} from "../../types/project-task.types";

import type {
  ProjectTaskCompletionDecision,
} from "../../api/project-task.api";


interface Props {
  open: boolean;

  task:
    | ProjectTask
    | null;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    decision:
      ProjectTaskCompletionDecision,
    reviewNote?: string,
  ) => Promise<void>;
}


const formatWorkedTime = (
  totalSeconds: number,
) => {
  const safeSeconds =
    Math.max(
      0,
      totalSeconds || 0,
    );

  const hours =
    Math.floor(
      safeSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60,
    );

  if (
    hours === 0 &&
    minutes === 0
  ) {
    return "Less than 1 minute";
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};


const formatDateTime = (
  value?:
    | string
    | null,
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};


const getEmployeeName = (
  task: ProjectTask,
) => {
  const employee =
    task.assignedProjectMember
      ?.employee;

  if (!employee) {
    return "-";
  }

  const fullName =
    [
      employee.firstName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    employee.displayName ||
    fullName ||
    employee.employeeCode ||
    "-"
  );
};


const TaskCompletionReviewModal = ({
  open,
  task,
  loading = false,
  onClose,
  onSubmit,
}: Props) => {
  const [
    reviewNote,
    setReviewNote,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    if (!open) {
      return;
    }

    setReviewNote("");
    setError(null);
  }, [
    open,
    task?.uuid,
  ]);


  if (!task) {
    return null;
  }


  const completionRequest =
    task.completionRequests?.[0];


  const handleClose = () => {
    if (loading) {
      return;
    }

    setReviewNote("");
    setError(null);

    onClose();
  };


  const handleApprove =
    async () => {
      if (
        !completionRequest
      ) {
        return;
      }

      setError(null);

      await onSubmit(
        "APPROVED",
        reviewNote.trim() ||
          undefined,
      );
    };


  const handleRequestChanges =
    async () => {
      if (
        !completionRequest
      ) {
        return;
      }

      const note =
        reviewNote.trim();

      if (!note) {
        setError(
          "Review note is required when requesting changes.",
        );

        return;
      }

      setError(null);

      await onSubmit(
        "REJECTED",
        note,
      );
    };


  const employeeName =
    getEmployeeName(task);

  const projectRoleName =
    task.assignedProjectMember
      ?.projectRole
      ?.name ?? "-";

  const designationName =
    task.assignedProjectMember
      ?.employee
      ?.designation
      ?.name;

  const departmentName =
    task.assignedProjectMember
      ?.employee
      ?.department
      ?.name;


  return (
    <Modal
      open={open}
      title="Review Task Completion"
      onClose={
        handleClose
      }
    >
      {!completionRequest ? (
        <div
          style={{
            padding: "20px 0",
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          No pending completion
          request found for this
          task.
        </div>
      ) : (
        <>
          {/* Task */}

          <div
            style={{
              padding: 16,
              marginBottom: 18,
              border:
                "1px solid #e5e7eb",
              borderRadius: 10,
              background:
                "#f9fafb",
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {task.title}
            </div>

            {task.description && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#6b7280",
                }}
              >
                {
                  task.description
                }
              </div>
            )}
          </div>


          {/* Request information */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <InfoItem
              label="Employee"
              value={
                employeeName
              }
            />

            <InfoItem
              label="Project Role"
              value={
                projectRoleName
              }
            />

            {designationName && (
              <InfoItem
                label="Designation"
                value={
                  designationName
                }
              />
            )}

            {departmentName && (
              <InfoItem
                label="Department"
                value={
                  departmentName
                }
              />
            )}

            <InfoItem
              label="Worked Time"
              value={
                formatWorkedTime(
                  completionRequest
                    .workedSeconds,
                )
              }
            />

            <InfoItem
              label="Requested At"
              value={
                formatDateTime(
                  completionRequest
                    .requestedAt,
                )
              }
            />
          </div>


          {/* Completion message */}

          <div
            style={{
              marginBottom: 20,
            }}
          >
            <div
              style={{
                marginBottom: 7,
                fontSize: 12,
                fontWeight: 700,
                color: "#6b7280",
                textTransform:
                  "uppercase",
              }}
            >
              Completion Message
            </div>

            <div
              style={{
                padding:
                  "12px 14px",
                minHeight: 70,
                border:
                  "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.6,
                color: "#374151",
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {completionRequest
                .report
                ?.message ||
                "No completion message provided."}
            </div>
          </div>


          {/* Review note */}

          <div>
            <label
              htmlFor="completion-review-note"
              style={{
                display: "block",
                marginBottom: 7,
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Review Note
            </label>

            <textarea
              id="completion-review-note"
              value={
                reviewNote
              }
              disabled={
                loading
              }
              maxLength={5000}
              rows={5}
              placeholder="Add feedback for the employee. Required when requesting changes."
              onChange={(
                event,
              ) => {
                setReviewNote(
                  event.target
                    .value,
                );

                if (error) {
                  setError(null);
                }
              }}
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                resize:
                  "vertical",
                padding:
                  "12px 14px",
                border:
                  error
                    ? "1px solid #dc2626"
                    : "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.5,
                outline: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 12,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color:
                    error
                      ? "#dc2626"
                      : "#6b7280",
                }}
              >
                {error ||
                  "Optional for approval. Required when requesting changes."}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  flexShrink: 0,
                }}
              >
                {reviewNote.length}
                /5000
              </div>
            </div>
          </div>


          {/* Actions */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              alignItems:
                "center",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 24,
              paddingTop: 18,
              borderTop:
                "1px solid #e5e7eb",
            }}
          >
            <Button
              variant="secondary"
              disabled={loading}
              onClick={
                handleClose
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              disabled={loading}
              onClick={
                handleRequestChanges
              }
            >
              Request Changes
            </Button>

            <Button
              loading={loading}
              disabled={loading}
              onClick={
                handleApprove
              }
            >
              Approve Completion
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};


interface InfoItemProps {
  label: string;
  value: string;
}


const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div
      style={{
        padding:
          "11px 13px",
        border:
          "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          marginBottom: 4,
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
};


export default TaskCompletionReviewModal;