import {
  useState,
} from "react";

import Button from "@/shared/components/Button";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import ProjectTaskForm from "./ProjectTaskForm";
import ProjectTaskTable from "./ProjectTaskTable";
import TaskCompletionReviewModal from "./TaskCompletionReviewModal";
import ProjectTaskActivityModal from "./ProjectTaskActivityModal";

import {
  useProjectTasks,
} from "../../hooks/useProjectTasks";

import type {
  ProjectTaskCompletionDecision,
} from "../../api/project-task.api";

import type {
  CreateProjectTaskRequest,
  ProjectTask,
  ProjectTaskFormData,
  UpdateProjectTaskRequest,
} from "../../types/project-task.types";


interface ProjectMemberOption {
  uuid: string;

  label: string;
}


interface Props {
  projectUuid: string;

  projectMembers:
    ProjectMemberOption[];

  loadingMembers?: boolean;
}


const initialFormData:
  ProjectTaskFormData = {
  title: "",
  description: "",
  priority: "MEDIUM",
  startDate: "",
  dueDate: "",
  assignedProjectMemberUuid: "",
  remarks: "",
  sortOrder: 0,
};


const ProjectTasksPanel = ({
  projectUuid,
  projectMembers,
  loadingMembers = false,
}: Props) => {
  const {
    hasPermission,
  } = useAuthorization();


  /*
   * =========================================================
   * PERMISSIONS
   * =========================================================
   */

  const canViewTask =
    hasPermission(
      "company.task.view",
    );


  const canCreateTask =
    hasPermission(
      "company.task.create",
    );


  const canUpdateTask =
    hasPermission(
      "company.task.update",
    );


  const canDeleteTask =
    hasPermission(
      "company.task.delete",
    );


  /*
   * Completion review currently uses
   * company.task.update.
   */
  const canReviewTask =
    canUpdateTask;


  /*
   * Activity visibility is controlled by
   * company.task.view.
   *
   * Backend remains responsible for
   * PROJECT / COMPANY scope enforcement.
   */
  const canViewActivity =
    canViewTask;


  const {
    projectTasks,

    loading,
    fetching,

    fetchProjectTask,

    create,
    update,
    remove,

    reviewCompletion,

    saving,
    deleting,
    reviewing,
  } = useProjectTasks(
    projectUuid,
  );


  /*
   * =========================================================
   * CREATE / EDIT STATE
   * =========================================================
   */

  const [
    showForm,
    setShowForm,
  ] = useState(
    false,
  );


  const [
    editTaskUuid,
    setEditTaskUuid,
  ] = useState<
    string | null
  >(
    null,
  );


  /*
   * =========================================================
   * COMPLETION REVIEW STATE
   * =========================================================
   */

  const [
    reviewTask,
    setReviewTask,
  ] = useState<
    ProjectTask | null
  >(
    null,
  );


  /*
   * =========================================================
   * ACTIVITY STATE
   * =========================================================
   *
   * Manager / Company Admin can inspect
   * task activity from project workspace.
   */
  const [
    activityTask,
    setActivityTask,
  ] = useState<
    ProjectTask | null
  >(
    null,
  );


  const [
    formData,
    setFormData,
  ] =
    useState<ProjectTaskFormData>({
      ...initialFormData,
    });


  const resetForm = () => {
    setEditTaskUuid(
      null,
    );

    setFormData({
      ...initialFormData,
    });
  };


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  const handleCreate = () => {
    if (
      !canCreateTask
    ) {
      return;
    }

    resetForm();

    setShowForm(
      true,
    );
  };


  const handleCancel = () => {
    resetForm();

    setShowForm(
      false,
    );
  };


  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  const handleEdit =
    async (
      taskUuid: string,
    ) => {
      if (
        !canUpdateTask
      ) {
        return;
      }

      try {
        const task =
          await fetchProjectTask(
            taskUuid,
          );


        /*
         * Completion review must go
         * through review workflow,
         * not normal task edit.
         */
        if (
          task.status ===
          "COMPLETION_REQUESTED"
        ) {
          return;
        }


        setEditTaskUuid(
          taskUuid,
        );


        setFormData({
          title:
            task.title,

          description:
            task.description ??
            "",

          priority:
            task.priority,

          startDate:
            task.startDate
              ?.slice(
                0,
                10,
              ) ?? "",

          dueDate:
            task.dueDate
              ?.slice(
                0,
                10,
              ) ?? "",

          assignedProjectMemberUuid:
            task.assignedProjectMember
              ?.uuid ?? "",

          remarks:
            task.remarks ??
            "",

          sortOrder:
            task.sortOrder ??
            0,
        });


        setShowForm(
          true,
        );
      } catch (error) {
        console.error(
          "Failed to load project task:",
          error,
        );
      }
    };


  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSubmit =
    async () => {
      try {
        if (
          !formData.title.trim()
        ) {
          return;
        }


        if (
          formData.startDate &&
          formData.dueDate &&
          formData.dueDate <
            formData.startDate
        ) {
          return;
        }


        if (
          editTaskUuid
        ) {
          if (
            !canUpdateTask
          ) {
            return;
          }


          const payload:
            UpdateProjectTaskRequest = {
            title:
              formData.title.trim(),

            description:
              formData.description
                .trim() ||
              undefined,

            priority:
              formData.priority,

            startDate:
              formData.startDate ||
              undefined,

            dueDate:
              formData.dueDate ||
              undefined,

            assignedProjectMemberUuid:
              formData
                .assignedProjectMemberUuid ||
              null,

            remarks:
              formData.remarks
                .trim() ||
              undefined,

            sortOrder:
              Number(
                formData.sortOrder ??
                0,
              ),
          };


          await update(
            editTaskUuid,
            payload,
          );
        } else {
          if (
            !canCreateTask
          ) {
            return;
          }


          const payload:
            CreateProjectTaskRequest = {
            title:
              formData.title.trim(),

            description:
              formData.description
                .trim() ||
              undefined,

            priority:
              formData.priority,

            startDate:
              formData.startDate ||
              undefined,

            dueDate:
              formData.dueDate ||
              undefined,

            assignedProjectMemberUuid:
              formData
                .assignedProjectMemberUuid ||
              null,

            remarks:
              formData.remarks
                .trim() ||
              undefined,

            sortOrder:
              Number(
                formData.sortOrder ??
                0,
              ),
          };


          await create(
            payload,
          );
        }


        handleCancel();
      } catch (error) {
        console.error(
          "Failed to save project task:",
          error,
        );
      }
    };


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete =
    async (
      taskUuid: string,
    ) => {
      if (
        !canDeleteTask
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?",
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {
        await remove(
          taskUuid,
        );
      } catch (error) {
        console.error(
          "Failed to delete project task:",
          error,
        );
      }
    };


  /*
   * =========================================================
   * ACTIVITY
   * =========================================================
   */

  const handleOpenActivity = (
    task:
      ProjectTask,
  ) => {
    if (
      !canViewActivity
    ) {
      return;
    }


    setActivityTask(
      task,
    );
  };


  const handleCloseActivity =
    () => {
      setActivityTask(
        null,
      );
    };


  /*
   * =========================================================
   * COMPLETION REVIEW
   * =========================================================
   */

  const handleOpenReview = (
    task: ProjectTask,
  ) => {
    if (
      !canReviewTask
    ) {
      return;
    }


    const pendingRequest =
      task.completionRequests?.find(
        (
          request,
        ) =>
          request.status ===
          "PENDING",
      );


    if (
      task.status !==
        "COMPLETION_REQUESTED" ||
      !pendingRequest
    ) {
      return;
    }


    setReviewTask(
      task,
    );
  };


  const handleCloseReview =
    () => {
      if (
        reviewing
      ) {
        return;
      }


      setReviewTask(
        null,
      );
    };


  const handleReviewCompletion =
    async (
      decision:
        ProjectTaskCompletionDecision,

      reviewNote?:
        string,
    ) => {
      if (
        !reviewTask ||
        !canReviewTask
      ) {
        return;
      }


      try {
        await reviewCompletion(
          reviewTask.uuid,
          {
            decision,
            reviewNote,
          },
        );


        setReviewTask(
          null,
        );
      } catch (error) {
        console.error(
          "Failed to review task completion:",
          error,
        );
      }
    };


  /*
   * =========================================================
   * CREATE / EDIT VIEW
   * =========================================================
   */

  if (
    showForm
  ) {
    return (
      <>
        <div
          style={{
            marginBottom:
              18,
          }}
        >
          <div
            style={{
              fontSize:
                16,

              fontWeight:
                700,
            }}
          >
            {
              editTaskUuid
                ? "Edit Task"
                : "Create Task"
            }
          </div>


          <div
            style={{
              marginTop:
                4,

              fontSize:
                12,

              color:
                "#6b7280",
            }}
          >
            {
              editTaskUuid
                ? "Update task details and assignment."
                : "Create a new task for this project."
            }
          </div>
        </div>


        <ProjectTaskForm
          formData={
            formData
          }
          setFormData={
            setFormData
          }
          projectMembers={
            projectMembers
          }
          isEdit={
            Boolean(
              editTaskUuid,
            )
          }
          loadingMembers={
            loadingMembers
          }
        />


        <div
          style={{
            display:
              "flex",

            justifyContent:
              "flex-end",

            gap:
              12,

            marginTop:
              24,
          }}
        >
          <Button
            variant="secondary"
            disabled={
              saving
            }
            onClick={
              handleCancel
            }
          >
            Back
          </Button>


          <Button
            loading={
              saving
            }
            disabled={
              !formData.title.trim() ||
              saving
            }
            onClick={
              handleSubmit
            }
          >
            {
              editTaskUuid
                ? "Update Task"
                : "Create Task"
            }
          </Button>
        </div>
      </>
    );
  }


  /*
   * =========================================================
   * TASK LIST
   * =========================================================
   */

  return (
    <>
      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            12,

          marginBottom:
            16,
        }}
      >
        <div>
          <div
            style={{
              fontSize:
                16,

              fontWeight:
                700,
            }}
          >
            Tasks
          </div>


          <div
            style={{
              marginTop:
                3,

              fontSize:
                12,

              color:
                "#6b7280",
            }}
          >
            {
              projectTasks.length
            }{" "}
            task
            {
              projectTasks.length ===
              1
                ? ""
                : "s"
            }

            {
              fetching &&
              !loading
                ? " · Updating..."
                : ""
            }
          </div>
        </div>


        {canCreateTask && (
          <Button
            onClick={
              handleCreate
            }
          >
            Create Task
          </Button>
        )}
      </div>


      <ProjectTaskTable
        data={
          projectTasks
        }
        loading={
          loading
        }
        canEdit={
          canUpdateTask
        }
        canDelete={
          canDeleteTask
        }
        canReview={
          canReviewTask
        }
        canViewActivity={
          canViewActivity
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
        onReview={
          handleOpenReview
        }
        onActivity={
          handleOpenActivity
        }
      />


      {deleting && (
        <div
          style={{
            marginTop:
              8,

            fontSize:
              12,

            color:
              "#6b7280",
          }}
        >
          Deleting task...
        </div>
      )}


      {/*
       * =====================================================
       * TASK ACTIVITY
       * =====================================================
       *
       * Manager + Company Admin project
       * workspace activity.
       */}
      <ProjectTaskActivityModal
        open={
          Boolean(
            activityTask,
          )
        }
        projectUuid={
          projectUuid
        }
        task={
          activityTask
        }
        onClose={
          handleCloseActivity
        }
      />


      {/*
       * =====================================================
       * COMPLETION REVIEW
       * =====================================================
       */}
      <TaskCompletionReviewModal
        open={
          Boolean(
            reviewTask,
          )
        }
        task={
          reviewTask
        }
        loading={
          reviewing
        }
        onClose={
          handleCloseReview
        }
        onSubmit={
          handleReviewCompletion
        }
      />
    </>
  );
};


export default ProjectTasksPanel;