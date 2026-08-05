// src/modules/project-category/pages/ProjectCategoryListPage.tsx

import {
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import ProjectCategoryDetailsModal from "../components/ProjectCategoryDetailsModal";
import ProjectCategoryModal from "../components/ProjectCategoryModal";
import ProjectCategoryTable from "../components/ProjectCategoryTable";

import {
  useProjectCategories,
} from "../hooks/useProjectCategory";

import type {
  CreateProjectCategoryDto,
  ProjectCategoryFormData,
  UpdateProjectCategoryDto,
} from "../types/project-category.types";

const initialFormData:
  ProjectCategoryFormData = {
    name: "",
    code: "",
    description: "",
    color: "#3B82F6",
    sortOrder: 0,
    status: "ACTIVE",
  };

const ProjectCategoryListPage = () => {
  const {
    loading,
    categories,
    selectedCategory,
    fetchCategories,
    fetchCategory,
    create,
    update,
    remove,
  } = useProjectCategories();

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
  ] =
    useState<ProjectCategoryFormData>(
      () => ({
        ...initialFormData,
      }),
    );

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

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

  const handleSubmit =
    async () => {
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

        color:
          formData.color ||
          undefined,

        sortOrder:
          Number(
            formData.sortOrder ??
              0,
          ),
      };

      if (editId) {
        const payload:
          UpdateProjectCategoryDto = {
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
          CreateProjectCategoryDto = {
            ...basePayload,
          };

        await create(
          payload,
        );
      }

      await fetchCategories();

      setOpenModal(false);
      resetForm();
    };

  const handleEdit = async (
    uuid: string,
  ) => {
    const response =
      await fetchCategory(
        uuid,
      );

    const category =
      "category" in response
        ? response.category
        : response;

    if (!category) {
      return;
    }

    setEditId(uuid);

    setFormData({
      name:
        category.name,

      code:
        category.code,

      description:
        category.description ??
        "",

      color:
        category.color ??
        "#3B82F6",

      sortOrder:
        category.sortOrder ??
        0,

      status:
        category.status,
    });

    setOpenModal(true);
  };

  const handleView = async (
    uuid: string,
  ) => {
    await fetchCategory(
      uuid,
    );

    setOpenDetails(true);
  };

  const handleDelete = async (
    uuid: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project category?",
      );

    if (!confirmed) {
      return;
    }

    await remove(uuid);

    await fetchCategories();
  };

  const handleCloseModal =
    () => {
      setOpenModal(false);
      resetForm();
    };

  return (
    <>
      <PageHeader
        title="Project Categories"
        subtitle="Manage project categories"
        actions={
          <Button
            onClick={
              handleOpenCreateModal
            }
          >
            Create Category
          </Button>
        }
      />

      <Card>
        <ProjectCategoryTable
          data={categories}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={
            handleDelete
          }
        />
      </Card>

      <ProjectCategoryModal
        open={openModal}
        loading={loading}
        title={
          editId
            ? "Edit Project Category"
            : "Create Project Category"
        }
        isEdit={Boolean(editId)}
        formData={formData}
        setFormData={setFormData}
        onClose={
          handleCloseModal
        }
        onSubmit={handleSubmit}
      />

      <ProjectCategoryDetailsModal
        open={openDetails}
        loading={loading}
        category={
          selectedCategory
        }
        onClose={() =>
          setOpenDetails(
            false,
          )
        }
      />
    </>
  );
};

export default ProjectCategoryListPage;