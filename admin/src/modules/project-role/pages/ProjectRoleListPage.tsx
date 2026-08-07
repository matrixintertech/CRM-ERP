import {
  useEffect,
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
  CreateProjectRoleDto,
  ProjectRoleFormData,
  UpdateProjectRoleDto,
} from "../types/project-role.types";

const initialFormData: ProjectRoleFormData = {
  name: "",
  code: "",
  description: "",
  isSingleAssignee: false,
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
    selectedProjectRole,

    fetchProjectRoles,
    fetchProjectRole,

    create,
    update,
    remove,

    clearSelectedProjectRole,
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
    editId,
    setEditId,
  ] = useState<string | null>(
    null,
  );

  const [
    formData,
    setFormData,
  ] = useState(() => ({
    ...initialFormData,
  }));

  useEffect(() => {
    void fetchProjectRoles();
  }, [fetchProjectRoles]);

  const resetForm = () => {
    setEditId(null);

    setFormData({
      ...initialFormData,
    });
  };

  const handleOpenCreateModal =
    () => {
      resetForm();

      setOpenModal(true);
    };

  const handleCloseModal =
    () => {
      setOpenModal(false);

      resetForm();
    };

  const handleCloseDetails =
    () => {
      setOpenDetails(false);

      clearSelectedProjectRole();
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

          sortOrder:
            Number(
              formData.sortOrder ??
                0,
            ),
        };

        if (editId) {
          const payload:
            UpdateProjectRoleDto = {
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
            CreateProjectRoleDto = {
            ...basePayload,
          };

          await create(
            payload,
          );
        }

        await fetchProjectRoles();

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

        setEditId(uuid);

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

          sortOrder:
            projectRole.sortOrder ??
            0,

          status:
            projectRole.status,
        });

        setOpenModal(true);
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
      try {
        clearSelectedProjectRole();

        setOpenDetails(true);

        await fetchProjectRole(
          uuid,
        );
      } catch (error) {
        console.error(
          "Failed to load project role details:",
          error,
        );

        setOpenDetails(false);
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
        await remove(uuid);
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
          data={projectRoles}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={
            handleDelete
          }
        />
      </Card>

      <ProjectRoleModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit Project Role"
            : "Create Project Role"
        }
        isEdit={
          Boolean(editId)
        }
        formData={
          formData
        }
        setFormData={
          setFormData
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
          loading
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