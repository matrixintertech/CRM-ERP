import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";

import ProjectMemberForm from "./ProjectMemberForm";
import ProjectMemberTable from "./ProjectMemberTable";

import {
  useProjectMembers,
} from "../../hooks/useProjectMembers";

import type {
  ProjectMemberFormData,
} from "../../types/project-member.types";

interface EmployeeOption {
  uuid: string;
  label: string;
}

interface ProjectRoleOption {
  uuid: string;
  name: string;
  status:
    | "ACTIVE"
    | "INACTIVE";
}

interface Props {
  projectUuid: string;

  employees: EmployeeOption[];

  projectRoles:
    ProjectRoleOption[];

  loadingEmployees?: boolean;

  loadingRoles?: boolean;

  onMembersChange?: (
    count: number,
  ) => void;
}

const initialFormData:
  ProjectMemberFormData = {
  employeeUuid: "",
  projectRoleUuid: "",
  remarks: "",
};

const ProjectMembersPanel = ({
  projectUuid,

  employees,
  projectRoles,

  loadingEmployees = false,
  loadingRoles = false,

  onMembersChange,
}: Props) => {
  const {
    projectMembers,

    loading,

    fetchProjectMembers,
    fetchProjectMember,

    assign,
    update,
    remove,

    clearSelectedProjectMember,
  } = useProjectMembers();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editMemberUuid,
    setEditMemberUuid,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<ProjectMemberFormData>({
      ...initialFormData,
    });

  const loadMembers =
    async () => {
      const members =
        await fetchProjectMembers(
          projectUuid,
        );

      const activeCount =
        members.filter(
          (member) =>
            member.isActive,
        ).length;

      onMembersChange?.(
        activeCount,
      );

      return members;
    };

  useEffect(() => {
    void loadMembers();
  }, [
    projectUuid,
  ]);

  const resetForm = () => {
    setEditMemberUuid(
      null,
    );

    setFormData({
      ...initialFormData,
    });

    clearSelectedProjectMember();
  };

  const handleCreate = () => {
    resetForm();

    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();

    setShowForm(false);
  };

  const handleEdit =
    async (
      memberUuid: string,
    ) => {
      try {
        const member =
          await fetchProjectMember(
            projectUuid,
            memberUuid,
          );

        setEditMemberUuid(
          memberUuid,
        );

        setFormData({
          employeeUuid:
            member.employee.uuid,

          projectRoleUuid:
            member.projectRole.uuid,

          remarks:
            member.remarks ??
            "",
        });

        setShowForm(true);
      } catch (error) {
        console.error(
          "Failed to load project member:",
          error,
        );
      }
    };

  const handleSubmit =
    async () => {
      if (
        !formData.employeeUuid ||
        !formData.projectRoleUuid
      ) {
        return;
      }

      try {
        const payload = {
          employeeUuid:
            formData.employeeUuid,

          projectRoleUuid:
            formData.projectRoleUuid,

          remarks:
            formData.remarks
              .trim() ||
            undefined,
        };

        if (
          editMemberUuid
        ) {
          await update(
            projectUuid,
            editMemberUuid,
            payload,
          );
        } else {
          await assign(
            projectUuid,
            payload,
          );
        }

        await loadMembers();

        handleCancel();
      } catch (error) {
        console.error(
          "Failed to save project member:",
          error,
        );
      }
    };

  const handleDelete =
    async (
      memberUuid: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to remove this project member?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          projectUuid,
          memberUuid,
        );

        await loadMembers();
      } catch (error) {
        console.error(
          "Failed to remove project member:",
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
            {editMemberUuid
              ? "Edit Member Assignment"
              : "Assign Member"}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            {editMemberUuid
              ? "Update employee and project role assignment."
              : "Assign an employee to this project with a project role."}
          </div>
        </div>

        <ProjectMemberForm
          formData={
            formData
          }
          setFormData={
            setFormData
          }
          employees={
            employees
          }
          projectRoles={
            projectRoles
          }
          loadingEmployees={
            loadingEmployees
          }
          loadingRoles={
            loadingRoles
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
            disabled={loading}
            onClick={
              handleCancel
            }
          >
            Back
          </Button>

          <Button
            loading={loading}
            disabled={
              !formData.employeeUuid ||
              !formData.projectRoleUuid
            }
            onClick={
              handleSubmit
            }
          >
            {editMemberUuid
              ? "Update Assignment"
              : "Assign Member"}
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
          alignItems:
            "center",
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
            Project Members
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            {
              projectMembers.filter(
                (member) =>
                  member.isActive,
              ).length
            }{" "}
            active member
            {projectMembers.filter(
              (member) =>
                member.isActive,
            ).length === 1
              ? ""
              : "s"}
          </div>
        </div>

        <Button
          onClick={
            handleCreate
          }
        >
          Assign Member
        </Button>
      </div>

      <ProjectMemberTable
        data={
          projectMembers
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

export default ProjectMembersPanel;