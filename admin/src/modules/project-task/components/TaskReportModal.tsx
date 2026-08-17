import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import type {
  ProjectTaskReportType,
} from "../api/my-task.api";

import type {
  MyTask,
} from "../types/my-task.types";


interface TaskReportModalProps {
  open:
    boolean;

  task:
    MyTask | null;

  type:
    ProjectTaskReportType | null;

  loading:
    boolean;

  onClose:
    () => void;

  onSubmit:
    (
      message: string,
    ) => Promise<void>;
}


const TaskReportModal = ({
  open,
  task,
  type,
  loading,
  onClose,
  onSubmit,
}: TaskReportModalProps) => {
  const [
    message,
    setMessage,
  ] = useState("");


  /*
   * Modal open hone ya selected
   * task/report type change hone par
   * previous message clear karo.
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
    type,
  ]);


  const config =
    useMemo(
      () =>
        getReportConfig(
          type,
        ),
      [
        type,
      ],
    );


  const normalizedMessage =
    message.trim();


  const canSubmit =
    Boolean(
      task &&
      type &&
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
      title={
        config.title
      }
      onClose={
        handleClose
      }
    >
      {!task ||
      !type ? (
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
              "flex",

            flexDirection:
              "column",

            gap:
              20,
          }}
        >
          {/* Task Summary */}

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
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "flex-start",

                gap:
                  12,

                flexWrap:
                  "wrap",
              }}
            >
              <div
                style={{
                  minWidth:
                    0,

                  flex:
                    1,
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
              </div>


              <span
                style={{
                  padding:
                    "5px 9px",

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

                  whiteSpace:
                    "nowrap",
                }}
              >
                {
                  config.label
                }
              </span>
            </div>


            {task.description && (
              <div
                style={{
                  marginTop:
                    12,

                  color:
                    "#4b5563",

                  fontSize:
                    13,

                  lineHeight:
                    1.5,
                }}
              >
                {
                  task.description
                }
              </div>
            )}
          </section>


          {/* Report Message */}

          <div>
            <label
              htmlFor="task-report-message"
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
              {
                config.fieldLabel
              }
            </label>


            <textarea
              id="task-report-message"
              name="message"
              rows={
                7
              }
              maxLength={
                5000
              }
              autoFocus
              disabled={
                loading
              }
              placeholder={
                config.placeholder
              }
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

                padding:
                  "12px 14px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  8,

                resize:
                  "vertical",

                minHeight:
                  150,

                color:
                  "#111827",

                background:
                  loading
                    ? "#f9fafb"
                    : "#ffffff",

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
                {
                  config.helpText
                }
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
              variant={
                type ===
                "BLOCKER"
                  ? "danger"
                  : undefined
              }
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
              {
                config.submitLabel
              }
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


const getReportConfig = (
  type:
    ProjectTaskReportType | null,
) => {
  switch (
    type
  ) {
    case "BLOCKER":
      return {
        title:
          "Report Blocker",

        label:
          "BLOCKER",

        fieldLabel:
          "Describe the blocker",

        placeholder:
          "Explain what is blocking your work, what you need, and any relevant details...",

        helpText:
          "The task will remain In Progress.",

        submitLabel:
          "Report Blocker",

        background:
          "#fef2f2",

        color:
          "#b91c1c",
      };


    case "NOTE":
      return {
        title:
          "Add Task Note",

        label:
          "NOTE",

        fieldLabel:
          "Note",

        placeholder:
          "Add any useful note or context about this task...",

        helpText:
          "Use notes for additional task context.",

        submitLabel:
          "Add Note",

        background:
          "#f3f4f6",

        color:
          "#374151",
      };


    case "PROGRESS":
    default:
      return {
        title:
          "Add Progress Update",

        label:
          "PROGRESS",

        fieldLabel:
          "Progress update",

        placeholder:
          "Describe what you completed, current progress, and what you are working on next...",

        helpText:
          "Share a clear update about your task progress.",

        submitLabel:
          "Add Progress",

        background:
          "#eff6ff",

        color:
          "#1d4ed8",
      };
  }
};


export default TaskReportModal;