import {
  useState,
} from "react";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import ProjectRoleDetailsModal from "../components/ProjectRoleDetailsModal";
import ProjectRoleModal from "../components/ProjectRoleModal";
import ProjectRoleTable from "../components/ProjectRoleTable";

import {
  useProjectRoles,
} from "../hooks/useProjectRoles";

import type {
  CreateProjectRoleRequest,
  ProjectRole,
  ProjectRoleFormData,
  UpdateProjectRoleRequest,
} from "../types/project-role.types";

const initialFormData:
  ProjectRoleFormData = {
  name: "",
  code: "",
  description: "",
  isSingleAssignee: false,
  requiredRoleUuid: "",
  sortOrder: 0,
  status: "ACTIVE",
};

const ProjectRoleListPage = () => {
  useDocumentTitle(
    "Project Roles",
  );

  const {
    loading,

    projectRoles,

    fetchProjectRole,

    create,
    update,
    remove,

    saving,
  } = useProjectRoles();

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    openDetails,
    setOpenDetails,
  ] = useState(false);

  const [
    selectedProjectRole,
    setSelectedProjectRole,
  ] = useState<
    ProjectRole | null
  >(null);

  const [
    editId,
    setEditId,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<ProjectRoleFormData>({
      ...initialFormData,
    });

  const resetForm = () => {
    setEditId(
      null,
    );

    setFormData({
      ...initialFormData,
    });
  };

  const handleOpenCreateModal =
    () => {
      resetForm();

      setOpenModal(
        true,
      );
    };

  const handleCloseModal =
    () => {
      setOpenModal(
        false,
      );

      resetForm();
    };

  const handleCloseDetails =
    () => {
      setOpenDetails(
        false,
      );

      setSelectedProjectRole(
        null,
      );
    };

  const handleSubmit =
    async () => {
      try {
        const basePayload = {
          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase()
              .replace(
                /\s+/g,
                "_",
              ),

          description:
            formData.description
              ?.trim() ||
            undefined,

          isSingleAssignee:
            formData.isSingleAssignee,

          requiredRoleUuid:
            formData.requiredRoleUuid ||
            undefined,

          sortOrder:
            Number(
              formData.sortOrder ??
                0,
            ),
        };

        if (editId) {
          const payload:
            UpdateProjectRoleRequest = {
            ...basePayload,

            status:
              formData.status,
          };

          await update(
            editId,
            payload,
          );
        } else {
          const payload:
            CreateProjectRoleRequest = {
            ...basePayload,
          };

          await create(
            payload,
          );
        }

        handleCloseModal();
      } catch (error) {
        console.error(
          "Failed to save project role:",
          error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        const projectRole =
          await fetchProjectRole(
            uuid,
          );

        setEditId(
          uuid,
        );

        setFormData({
          name:
            projectRole.name,

          code:
            projectRole.code,

          description:
            projectRole.description ??
            "",

          isSingleAssignee:
            projectRole.isSingleAssignee,

          requiredRoleUuid:
            projectRole.requiredRole
              ?.uuid ?? "",

          sortOrder:
            projectRole.sortOrder ??
            0,

          status:
            projectRole.status,
        });

        setOpenModal(
          true,
        );
      } catch (error) {
        console.error(
          "Failed to load project role:",
          error,
        );
      }
    };

  const handleView =
    async (
      uuid: string,
    ) => {
      setSelectedProjectRole(
        null,
      );

      setOpenDetails(
        true,
      );

      try {
        const projectRole =
          await fetchProjectRole(
            uuid,
          );

        setSelectedProjectRole(
          projectRole,
        );
      } catch (error) {
        console.error(
          "Failed to load project role details:",
          error,
        );

        setOpenDetails(
          false,
        );
      }
    };

  const handleDelete =
    async (
      uuid: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this project role?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          uuid,
        );
      } catch (error) {
        console.error(
          "Failed to delete project role:",
          error,
        );
      }
    };

  return (
    <>
      <PageHeader
        title="Project Roles"
        subtitle="Manage project roles and assignment rules"
        actions={
          <Button
            onClick={
              handleOpenCreateModal
            }
          >
            Create Project Role
          </Button>
        }
      />

      <Card>
        <ProjectRoleTable
          data={
            projectRoles
          }
          loading={
            loading
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      </Card>

      <ProjectRoleModal
        open={
          openModal
        }
        loading={
          saving
        }
        title={
          editId
            ? "Edit Project Role"
            : "Create Project Role"
        }
        isEdit={
          Boolean(
            editId,
          )
        }
        formData={
          formData
        }
        setFormData={
          setFormData
        }
        projectRoles={
          projectRoles
        }
        currentRoleUuid={
          editId
        }
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />

      <ProjectRoleDetailsModal
        open={
          openDetails
        }
        loading={
          openDetails &&
          !selectedProjectRole
        }
        projectRole={
          selectedProjectRole
        }
        onClose={
          handleCloseDetails
        }
      />
    </>
  );
};

export default ProjectRoleListPage;