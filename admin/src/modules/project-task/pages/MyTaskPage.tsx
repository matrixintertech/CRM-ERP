import {
  useMemo,
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import {
  useMyTasks,
} from "../hooks/useMyTasks";

import MyTaskTable from "../components/MyTaskTable";
import TaskReportModal from "../components/TaskReportModal";
import TaskActivityModal from "../components/TaskActivityModal";
import RequestCompletionModal from "../components/RequestCompletionModal";

import type {
  ProjectTaskReportType,
} from "../api/my-task.api";

import type {
  MyTask,
  ProjectTaskStatus,
} from "../types/my-task.types";


type TaskFilter =
  | "ALL"
  | ProjectTaskStatus;


const filters: Array<{
  label: string;
  value: TaskFilter;
}> = [
  {
    label:
      "All",

    value:
      "ALL",
  },

  {
    label:
      "Todo",

    value:
      "TODO",
  },

  {
    label:
      "In Progress",

    value:
      "IN_PROGRESS",
  },

  {
    label:
      "Pending Review",

    value:
      "COMPLETION_REQUESTED",
  },

  {
    label:
      "Completed",

    value:
      "COMPLETED",
  },
];


const MyTaskPage = () => {
  useDocumentTitle(
    "My Tasks",
  );


  const {
    hasPermission,
  } =
    useAuthorization();


  const canExecute =
    hasPermission(
      "company.task.execute",
    );


  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<TaskFilter>(
      "ALL",
    );


  /*
   * Report modal state.
   */
  const [
    reportModalOpen,
    setReportModalOpen,
  ] =
    useState(false);


  const [
    selectedTask,
    setSelectedTask,
  ] =
    useState<
      MyTask | null
    >(null);


  const [
    reportType,
    setReportType,
  ] =
    useState<
      ProjectTaskReportType | null
    >(null);


  /*
   * Activity modal state.
   */
  const [
    activityModalOpen,
    setActivityModalOpen,
  ] =
    useState(false);


  const [
    activityTask,
    setActivityTask,
  ] =
    useState<
      MyTask | null
    >(null);


  /*
   * Completion request modal state.
   */
  const [
    completionModalOpen,
    setCompletionModalOpen,
  ] =
    useState(false);


  const [
    completionTask,
    setCompletionTask,
  ] =
    useState<
      MyTask | null
    >(null);


  const {
    tasks,
    loading,
    fetching,

    startWork,
    stopWork,
    addReport,
    requestCompletion,

    starting,
    stopping,
    reporting,
    requestingCompletion,
  } =
    useMyTasks();


  /*
   * Status filter.
   */
  const filteredTasks =
    useMemo(
      () => {
        if (
          activeFilter ===
          "ALL"
        ) {
          return tasks;
        }


        return tasks.filter(
          (
            task,
          ) =>
            task.status ===
            activeFilter,
        );
      },
      [
        tasks,
        activeFilter,
      ],
    );


  /*
   * Filter counters.
   */
  const counts =
    useMemo(
      () => ({
        ALL:
          tasks.length,

        TODO:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "TODO",
          ).length,

        IN_PROGRESS:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "IN_PROGRESS",
          ).length,

        COMPLETION_REQUESTED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "COMPLETION_REQUESTED",
          ).length,

        COMPLETED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "COMPLETED",
          ).length,

        CANCELLED:
          tasks.filter(
            (
              task,
            ) =>
              task.status ===
              "CANCELLED",
          ).length,
      }),
      [
        tasks,
      ],
    );


  /*
   * Start / resume employee work.
   */
  const handleStartWork =
    async (
      task: MyTask,
    ) => {
      if (
        !canExecute
      ) {
        return;
      }


      await startWork(
        task.project.uuid,
        task.uuid,
      );
    };


  /*
   * Stop current work session.
   */
  const handleStopWork =
    async (
      task: MyTask,
    ) => {
      if (
        !canExecute
      ) {
        return;
      }


      await stopWork(
        task.project.uuid,
        task.uuid,
      );
    };


  /*
   * Open task report modal.
   */
  const openReportModal = (
    task:
      MyTask,

    type:
      ProjectTaskReportType,
  ) => {
    if (
      !canExecute ||
      task.status !==
        "IN_PROGRESS"
    ) {
      return;
    }


    setSelectedTask(
      task,
    );

    setReportType(
      type,
    );

    setReportModalOpen(
      true,
    );
  };


  const handleAddProgress = (
    task:
      MyTask,
  ) => {
    openReportModal(
      task,
      "PROGRESS",
    );
  };


  const handleReportBlocker = (
    task:
      MyTask,
  ) => {
    openReportModal(
      task,
      "BLOCKER",
    );
  };


  const handleAddNote = (
    task:
      MyTask,
  ) => {
    openReportModal(
      task,
      "NOTE",
    );
  };


  /*
   * Activity modal.
   */
  const handleViewActivity = (
    task:
      MyTask,
  ) => {
    setActivityTask(
      task,
    );

    setActivityModalOpen(
      true,
    );
  };


  const handleCloseActivityModal =
    () => {
      setActivityModalOpen(
        false,
      );

      setActivityTask(
        null,
      );
    };


  /*
   * Completion request modal.
   *
   * Only:
   * - IN_PROGRESS
   * - no OPEN work session
   * - execute permission
   */
  const handleRequestCompletion = (
    task:
      MyTask,
  ) => {
    if (
      !canExecute ||
      task.status !==
        "IN_PROGRESS" ||
      task.workSessions?.length >
        0
    ) {
      return;
    }


    setCompletionTask(
      task,
    );

    setCompletionModalOpen(
      true,
    );
  };


  const handleCloseCompletionModal =
    () => {
      if (
        requestingCompletion
      ) {
        return;
      }


      setCompletionModalOpen(
        false,
      );

      setCompletionTask(
        null,
      );
    };


  /*
   * Submit completion request.
   */
  const handleSubmitCompletion =
    async (
      message: string,
    ) => {
      if (
        !completionTask ||
        !canExecute
      ) {
        return;
      }


      try {
        await requestCompletion(
          completionTask
            .project.uuid,

          completionTask.uuid,

          message,
        );


        setCompletionModalOpen(
          false,
        );

        setCompletionTask(
          null,
        );
      } catch {
        /*
         * Hook already shows
         * backend error notification.
         *
         * Modal remains open so
         * employee can retry.
         */
      }
    };


  /*
   * Close report modal.
   */
  const handleCloseReportModal =
    () => {
      if (
        reporting
      ) {
        return;
      }


      setReportModalOpen(
        false,
      );

      setSelectedTask(
        null,
      );

      setReportType(
        null,
      );
    };


  /*
   * =========================================================
   * SUBMIT TASK REPORT
   * =========================================================
   *
   * TaskReportModal sends:
   *
   * - message
   * - selected/captured File[]
   *
   * Hook handles:
   *
   * File[]
   *   ↓
   * presigned URLs
   *   ↓
   * direct R2 uploads
   *   ↓
   * final report creation
   */
  const handleSubmitReport =
    async (
      message: string,
      files: File[] = [],
    ) => {
      if (
        !selectedTask ||
        !reportType ||
        !canExecute
      ) {
        return;
      }


      try {
        await addReport(
          selectedTask
            .project.uuid,

          selectedTask.uuid,

          reportType,

          message,

          files,
        );


        setReportModalOpen(
          false,
        );

        setSelectedTask(
          null,
        );

        setReportType(
          null,
        );
      } catch {
        /*
         * useMyTasks already shows
         * API / upload error notification.
         *
         * Modal remains open so employee
         * can retry without losing
         * message / selected images.
         */
      }
    };


  return (
    <>
      <PageHeader
        title="My Tasks"
        subtitle="View and manage your assigned project tasks"
      />


      <Card>
        {/* Status Filters */}

        <div
          style={{
            display:
              "flex",

            gap:
              8,

            flexWrap:
              "wrap",

            marginBottom:
              24,
          }}
        >
          {filters.map(
            (
              filter,
            ) => {
              const active =
                activeFilter ===
                filter.value;


              const count =
                counts[
                  filter.value
                ] ??
                0;


              return (
                <Button
                  key={
                    filter.value
                  }
                  type="button"
                  size="sm"
                  variant={
                    active
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                >
                  {filter.label} (
                  {count})
                </Button>
              );
            },
          )}
        </div>


        {/* Background Refresh */}

        {fetching &&
          !loading && (
            <div
              style={{
                marginBottom:
                  12,

                fontSize:
                  12,

                color:
                  "#6b7280",
              }}
            >
              Updating tasks...
            </div>
          )}


        {/* Task Table */}

        <MyTaskTable
          tasks={
            filteredTasks
          }
          loading={
            loading
          }
          canExecute={
            canExecute
          }
          workLoading={
            starting ||
            stopping
          }
          reportLoading={
            reporting
          }
          completionLoading={
            requestingCompletion
          }
          onStartWork={
            handleStartWork
          }
          onStopWork={
            handleStopWork
          }
          onAddProgress={
            handleAddProgress
          }
          onReportBlocker={
            handleReportBlocker
          }
          onAddNote={
            handleAddNote
          }
          onViewActivity={
            handleViewActivity
          }
          onRequestCompletion={
            handleRequestCompletion
          }
        />
      </Card>


      {/* Task Report Modal */}

      <TaskReportModal
        open={
          reportModalOpen
        }
        task={
          selectedTask
        }
        type={
          reportType
        }
        loading={
          reporting
        }
        onClose={
          handleCloseReportModal
        }
        onSubmit={
          handleSubmitReport
        }
      />


      {/* Task Activity Modal */}

      <TaskActivityModal
        open={
          activityModalOpen
        }
        task={
          activityTask
        }
        onClose={
          handleCloseActivityModal
        }
      />


      {/* Request Completion Modal */}

      <RequestCompletionModal
        open={
          completionModalOpen
        }
        task={
          completionTask
        }
        loading={
          requestingCompletion
        }
        onClose={
          handleCloseCompletionModal
        }
        onSubmit={
          handleSubmitCompletion
        }
      />
    </>
  );
};


export default MyTaskPage;