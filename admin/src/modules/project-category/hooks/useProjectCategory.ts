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
  CreateProjectCategoryDto,
  ProjectCategory,
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
    useState<ProjectCategoryFormData>(
      () => ({
        ...initialFormData,
      }),
    );

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data =
        await getProjectCategories();

      setCategories(
        data.categories ?? [],
      );

      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (
    uuid: string,
  ) => {
    try {
      setLoading(true);

      const data =
        await getProjectCategoryByUuid(
          uuid,
        );

      setSelectedCategory(
        data.category,
      );

      return data.category;
    } finally {
      setLoading(false);
    }
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

      return data.category;
    } catch (error) {
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

      return data.category;
    } catch (error) {
      notify.error(
        "Failed to update project category.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    uuid: string,
  ) => {
    try {
      setLoading(true);

      await deleteProjectCategory(
        uuid,
      );

      setCategories(
        (previous) =>
          previous.filter(
            (category) =>
              category.uuid !== uuid,
          ),
      );

      notify.success(
        "Project category deleted successfully.",
      );
    } catch (error) {
      notify.error(
        "Failed to delete project category.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
    });
  };

  const clearSelectedCategory = () => {
    setSelectedCategory(null);
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
    clearSelectedCategory,
  };
};