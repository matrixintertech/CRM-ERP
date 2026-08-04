import {
  useState,
} from "react";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createProjectCategory,
  deleteProjectCategory,
  getProjectCategoryByUuid,
  getProjectCategories,
  updateProjectCategory,
} from "../api/project-category.api";


import type {
  ProjectCategory,
  CreateProjectCategoryDto,
  UpdateProjectCategoryDto,
} from "../types/project-category.types";



const initialFormData:
  CreateProjectCategoryDto = {

  name: "",

  code: "",

  description: "",

  color: "#3B82F6",

  sortOrder: 0,

};




export const useProjectCategories = () => {


  const [
    categories,
    setCategories,
  ] =
  useState<ProjectCategory[]>([]);



  const [
    selectedCategory,
    setSelectedCategory,
  ] =
  useState<ProjectCategory | null>(
    null,
  );



  const [
    loading,
    setLoading,
  ] =
  useState(false);



  const [
    formData,
    setFormData,
  ] =
  useState<CreateProjectCategoryDto>(
    initialFormData,
  );





  const fetchCategories = async () => {

    try {

      setLoading(true);


      const data =
        await getProjectCategories();


      setCategories(
        data.categories,
      );


      return data;


    } finally {

      setLoading(false);

    }

  };







  const fetchCategory = async (
    uuid: string,
  ) => {

    const data =
      await getProjectCategoryByUuid(
        uuid,
      );


    setSelectedCategory(
      data.category,
    );


    return data;

  };







  const create = async (
    payload:
      CreateProjectCategoryDto,
  ) => {

    try {

      setLoading(true);


      const data =
        await createProjectCategory(
          payload,
        );


      notify.success(
        "Project category created successfully.",
      );


      return data;


    } catch(error) {

      notify.error(
        "Failed to create project category.",
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };







  const update = async (
    uuid: string,

    payload:
      UpdateProjectCategoryDto,
  ) => {

    try {

      setLoading(true);


      const data =
        await updateProjectCategory(
          uuid,

          payload,
        );


      notify.success(
        "Project category updated successfully.",
      );


      return data;


    } catch(error) {

      notify.error(
        "Failed to update project category.",
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };







  const remove = async (
    uuid:string,
  ) => {

    try {

      setLoading(true);


      await deleteProjectCategory(
        uuid,
      );


      notify.success(
        "Project category deleted successfully.",
      );



      setCategories(
        (previous) =>
          previous.filter(
            (category) =>
              category.uuid !== uuid,
          ),
      );



    } catch(error) {

      notify.error(
        "Failed to delete project category.",
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };







  const resetForm = () => {

    setFormData(
      initialFormData,
    );

  };







  return {

    loading,


    categories,

    selectedCategory,


    formData,

    setFormData,


    fetchCategories,

    fetchCategory,


    create,

    update,

    remove,


    resetForm,

  };

};