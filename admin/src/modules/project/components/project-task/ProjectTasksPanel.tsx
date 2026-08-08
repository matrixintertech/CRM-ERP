import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";

import ProjectTaskForm from "./ProjectTaskForm";
import ProjectTaskTable from "./ProjectTaskTable";

import {
  useProjectTasks,
} from "../../hooks/useProjectTasks";

import type {
  CreateProjectTaskRequest,
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
  status: "TODO",
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
    projectTasks,
    loading,

    fetchProjectTasks,
    fetchProjectTask,

    create,
    update,
    remove,

    clearSelectedProjectTask,
  } = useProjectTasks();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editTaskUuid,
    setEditTaskUuid,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<ProjectTaskFormData>({
      ...initialFormData,
    });

  useEffect(() => {
    void fetchProjectTasks(
      projectUuid,
    );
  }, [
    projectUuid,
    fetchProjectTasks,
  ]);

  const resetForm = () => {
    setEditTaskUuid(
      null,
    );

    setFormData({
      ...initialFormData,
    });

    clearSelectedProjectTask();
  };

  const handleCreate = () => {
    resetForm();

    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();

    setShowForm(false);
  };

  const handleEdit = async (
    taskUuid: string,
  ) => {
    try {
      const task =
        await fetchProjectTask(
          projectUuid,
          taskUuid,
        );

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

        status:
          task.status,

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

      setShowForm(true);
    } catch (error) {
      console.error(
        "Failed to load project task:",
        error,
      );
    }
  };

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

        if (editTaskUuid) {
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

            status:
              formData.status,

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
            projectUuid,
            editTaskUuid,
            payload,
          );
        } else {
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

            status:
              formData.status,

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
            projectUuid,
            payload,
          );
        }

        await fetchProjectTasks(
          projectUuid,
        );

        handleCancel();
      } catch (error) {
        console.error(
          "Failed to save project task:",
          error,
        );
      }
    };

  const handleDelete =
    async (
      taskUuid: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          projectUuid,
          taskUuid,
        );

        await fetchProjectTasks(
          projectUuid,
        );
      } catch (error) {
        console.error(
          "Failed to delete project task:",
          error,
        );
      }
    };

  if (showForm) {
    return (
      <>
        <div
          style={{
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {editTaskUuid
              ? "Edit Task"
              : "Create Task"}
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
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <Button
            variant="secondary"
            disabled={
              loading
            }
            onClick={
              handleCancel
            }
          >
            Back
          </Button>

          <Button
            loading={
              loading
            }
            disabled={
              !formData.title.trim()
            }
            onClick={
              handleSubmit
            }
          >
            {editTaskUuid
              ? "Update Task"
              : "Create Task"}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Tasks
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            {
              projectTasks.length
            }{" "}
            task
            {projectTasks.length ===
            1
              ? ""
              : "s"}
          </div>
        </div>

        <Button
          onClick={
            handleCreate
          }
        >
          Create Task
        </Button>
      </div>

      <ProjectTaskTable
        data={
          projectTasks
        }
        loading={
          loading
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
      />
    </>
  );
};

export default ProjectTasksPanel;