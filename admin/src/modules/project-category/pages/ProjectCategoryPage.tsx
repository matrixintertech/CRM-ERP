// src/modules/project-category/pages/ProjectCategoryListPage.tsx

import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import {
  useProjectCategories,
} from "../hooks/useProjectCategory";

import ProjectCategoryTable from "../components/ProjectCategoryTable";
import ProjectCategoryModal from "../components/ProjectCategoryModal";
import ProjectCategoryDetailsModal from "../components/ProjectCategoryDetailsModal";
import type {
  CreateProjectCategoryDto,
} from "../types/project-category.types";


const initialFormData:
  CreateProjectCategoryDto = {
    name: "",

    code: "",

    description: "",

    color: "#3B82F6",

    sortOrder: 0,
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
    useState<CreateProjectCategoryRequest>(
      initialFormData,
    );


  useEffect(() => {
    fetchCategories();
  }, []);


  const handleOpenCreateModal =
    () => {
      setEditId(null);

      setFormData(
        initialFormData,
      );

      setOpenModal(true);
    };


  const handleSubmit =
    async () => {
      const payload:
        CreateProjectCategoryRequest = {
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
              ?.trim() || "",

          color:
            formData.color || "",

          sortOrder:
            Number(
              formData.sortOrder ??
                0,
            ),
        };


      if (editId) {
        await update(
          editId,
          payload,
        );
      } else {
        await create(
          payload,
        );
      }


      await fetchCategories();


      setOpenModal(false);

      setEditId(null);

      setFormData(
        initialFormData,
      );
    };


  const handleEdit =
    async (
      uuid: string,
    ) => {
      const response =
        await fetchCategory(
          uuid,
        );


      if (
        !response?.category
      ) {
        return;
      }


      const category =
        response.category;


      setEditId(
        uuid,
      );


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
      });


      setOpenModal(true);
    };


  const handleView =
    async (
      uuid: string,
    ) => {
      await fetchCategory(
        uuid,
      );

      setOpenDetails(true);
    };


  const handleDelete =
    async (
      uuid: string,
    ) => {
      await remove(
        uuid,
      );

      await fetchCategories();
    };


  const handleCloseModal =
    () => {
      setOpenModal(false);

      setEditId(null);

      setFormData(
        initialFormData,
      );
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
          data={
            categories
          }
          loading={
            loading
          }
          total={
            categories.length
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


      <ProjectCategoryModal
        open={
          openModal
        }
        loading={
          loading
        }
        title={
          editId
            ? "Edit Project Category"
            : "Create Project Category"
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
        onClose={
          handleCloseModal
        }
        onSubmit={
          handleSubmit
        }
      />


      <ProjectCategoryDetailsModal
        open={
          openDetails
        }
        loading={
          loading
        }
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