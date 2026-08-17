import {
  useEffect,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import type {
  MyTask,
} from "../types/my-task.types";


interface RequestCompletionModalProps {
  open:
    boolean;

  task:
    MyTask | null;

  loading:
    boolean;

  onClose:
    () => void;

  onSubmit:
    (
      message: string,
    ) => Promise<void>;
}


const RequestCompletionModal = ({
  open,
  task,
  loading,
  onClose,
  onSubmit,
}: RequestCompletionModalProps) => {
  const [
    message,
    setMessage,
  ] = useState("");


  /*
   * Every new open/task should start
   * with a clean completion summary.
   */
  useEffect(() => {
    if (
      open
    ) {
      setMessage("");
    }
  }, [
    open,
    task?.uuid,
  ]);


  const normalizedMessage =
    message.trim();


  const hasOpenWorkSession =
    Boolean(
      task?.workSessions?.[
        0
      ],
    );


  const canSubmit =
    Boolean(
      task &&
      task.status ===
        "IN_PROGRESS" &&
      !hasOpenWorkSession &&
      normalizedMessage,
    ) &&
    !loading;


  const handleClose =
    () => {
      if (
        loading
      ) {
        return;
      }


      setMessage("");

      onClose();
    };


  const handleSubmit =
    async () => {
      if (
        !canSubmit
      ) {
        return;
      }


      await onSubmit(
        normalizedMessage,
      );
  };


  return (
    <Modal
      open={
        open
      }
      title="Request Task Completion"
      onClose={
        handleClose
      }
    >
      {!task ? (
        <div
          style={{
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
          {/* Task summary */}

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
                  15,

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

                gap:
                  8,

                flexWrap:
                  "wrap",

                marginTop:
                  12,
              }}
            >
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
                Status:{" "}
                <strong>
                  {task.status.replace(
                    /_/g,
                    " ",
                  )}
                </strong>
              </span>


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
                Priority:{" "}
                <strong>
                  {
                    task.priority
                  }
                </strong>
              </span>
            </div>
          </section>


          {/* Open session warning */}

          {hasOpenWorkSession && (
            <div
              style={{
                padding:
                  "12px 14px",

                border:
                  "1px solid #fed7aa",

                borderRadius:
                  8,

                background:
                  "#fff7ed",

                color:
                  "#9a3412",

                fontSize:
                  13,

                lineHeight:
                  1.5,
              }}
            >
              You currently have an active work session.
              Stop work before requesting completion.
            </div>
          )}


          {/* Invalid task state */}

          {task.status !==
            "IN_PROGRESS" && (
            <div
              style={{
                padding:
                  "12px 14px",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  8,

                background:
                  "#f9fafb",

                color:
                  "#6b7280",

                fontSize:
                  13,
              }}
            >
              Only an in-progress task can be submitted
              for completion.
            </div>
          )}


          {/* Completion summary */}

          <div>
            <label
              htmlFor="task-completion-message"
              style={{
                display:
                  "block",

                marginBottom:
                  8,

                color:
                  "#374151",

                fontSize:
                  13,

                fontWeight:
                  600,
              }}
            >
              Completion summary
            </label>


            <textarea
              id="task-completion-message"
              name="message"
              rows={
                7
              }
              maxLength={
                5000
              }
              autoFocus
              disabled={
                loading ||
                hasOpenWorkSession ||
                task.status !==
                  "IN_PROGRESS"
              }
              placeholder="Describe what was completed, testing performed, final result, and any important handover notes..."
              value={
                message
              }
              onChange={(
                event,
              ) =>
                setMessage(
                  event.target
                    .value,
                )
              }
              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                minHeight:
                  150,

                padding:
                  "12px 14px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  8,

                resize:
                  "vertical",

                background:
                  loading ||
                  hasOpenWorkSession ||
                  task.status !==
                    "IN_PROGRESS"
                    ? "#f9fafb"
                    : "#ffffff",

                color:
                  "#111827",

                fontFamily:
                  "inherit",

                fontSize:
                  14,

                lineHeight:
                  1.5,

                outline:
                  "none",
              }}
            />


            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                gap:
                  12,

                marginTop:
                  6,

                color:
                  "#6b7280",

                fontSize:
                  11,
              }}
            >
              <span>
                This will send the task for manager review.
              </span>

              <span
                style={{
                  whiteSpace:
                    "nowrap",
                }}
              >
                {
                  message.length
                }
                /5000
              </span>
            </div>
          </div>


          {/* Workflow info */}

          <div
            style={{
              padding:
                "12px 14px",

              border:
                "1px solid #dbeafe",

              borderRadius:
                8,

              background:
                "#eff6ff",

              color:
                "#1e40af",

              fontSize:
                12,

              lineHeight:
                1.6,
            }}
          >
            After submission, the task will move to{" "}
            <strong>
              COMPLETION REQUESTED
            </strong>{" "}
            and wait for manager approval or rejection.
          </div>


          {/* Actions */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              gap:
                10,

              paddingTop:
                4,

              borderTop:
                "1px solid #f3f4f6",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                loading
              }
              onClick={
                handleClose
              }
            >
              Cancel
            </Button>


            <Button
              type="button"
              loading={
                loading
              }
              disabled={
                !canSubmit
              }
              onClick={
                handleSubmit
              }
            >
              Request Completion
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


export default RequestCompletionModal;