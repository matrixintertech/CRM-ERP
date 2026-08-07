import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import ProjectMemberForm from "./ProjectMemberForm";
import ProjectMemberTable from "./ProjectMemberTable";

import {
  useProjectMembers,
} from "../hooks/useProjectMembers";

import type {
  ProjectMemberFormData,
} from "../types/project-member.types";

interface EmployeeOption {
  uuid: string;
  label: string;
}

interface ProjectRoleOption {
  uuid: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

interface Props {
  open: boolean;

  projectUuid:
    | string
    | null;

  projectName?: string;

  employees: EmployeeOption[];

  projectRoles:
    ProjectRoleOption[];

  loadingEmployees?: boolean;

  loadingRoles?: boolean;

  onClose: () => void;
}

const initialFormData:
  ProjectMemberFormData = {
  employeeUuid: "",
  projectRoleUuid: "",
  remarks: "",
};

const ProjectMembersModal = ({
  open,

  projectUuid,
  projectName,

  employees,
  projectRoles,

  loadingEmployees = false,
  loadingRoles = false,

  onClose,
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
    clearProjectMembers,
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
    useState<ProjectMemberFormData>(
      {
        ...initialFormData,
      },
    );

  useEffect(() => {
    if (
      !open ||
      !projectUuid
    ) {
      return;
    }

    void fetchProjectMembers(
      projectUuid,
    );
  }, [
    open,
    projectUuid,
    fetchProjectMembers,
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

  const handleAssign = () => {
    resetForm();

    setShowForm(true);
  };

  const handleCancelForm =
    () => {
      resetForm();

      setShowForm(false);
    };

  const handleEdit = async (
    memberUuid: string,
  ) => {
    if (!projectUuid) {
      return;
    }

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
      if (!projectUuid) {
        return;
      }

      if (
        !formData.employeeUuid
      ) {
        return;
      }

      if (
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

        await fetchProjectMembers(
          projectUuid,
        );

        handleCancelForm();
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
      if (!projectUuid) {
        return;
      }

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

        await fetchProjectMembers(
          projectUuid,
        );
      } catch (error) {
        console.error(
          "Failed to remove project member:",
          error,
        );
      }
    };

  const handleClose = () => {
    resetForm();

    setShowForm(false);

    clearProjectMembers();

    onClose();
  };

  return (
    <Modal
      open={open}
      title={
        projectName
          ? `Project Members - ${projectName}`
          : "Project Members"
      }
      onClose={
        handleClose
      }
      size="lg"
    >
      {showForm ? (
        <>
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
              display:
                "flex",

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
                handleCancelForm
              }
            >
              Back
            </Button>

            <Button
              loading={
                loading
              }
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
      ) : (
        <>
          <div
            style={{
              display:
                "flex",

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
                  fontSize: 14,
                  fontWeight:
                    600,
                }}
              >
                Assigned Members
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 12,
                  color:
                    "#6b7280",
                }}
              >
                {
                  projectMembers.length
                }{" "}
                active member
                {projectMembers.length ===
                1
                  ? ""
                  : "s"}
              </div>
            </div>

            <Button
              onClick={
                handleAssign
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
      )}
    </Modal>
  );
};

export default ProjectMembersModal;