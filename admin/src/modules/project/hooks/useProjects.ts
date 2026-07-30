import { useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createProject,
  deleteProject,
  getProjectByUuid,
  getProjects,
  updateProject,
} from "../api/project.api";

import type {
  Project,
  ProjectListResponse,
  ProjectQuery,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

const initialFormData: CreateProjectRequest = {
  clientUuid: "",

  name: "",

  stateUuid: "",
  cityUuid: "",

  address: "",
  pincode: "",

  startDate: "",
  expectedEndDate: "",

  remarks: "",
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] =
    useState<CreateProjectRequest>(initialFormData);

  const fetchProjects = async (
    params?: ProjectQuery,
  ): Promise<ProjectListResponse> => {
    try {
      setLoading(true);

      const data = await getProjects(params ?? {});

      setProjects(data.projects);
      setTotal(data.total);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async (uuid: string) => {
    const data = await getProjectByUuid(uuid);

    setSelectedProject(data.project);

    return data;
  };

  const create = async (
    payload: CreateProjectRequest,
  ) => {
    try {
      setLoading(true);

      const data = await createProject(payload);

      notify.success(
        "Project created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create project.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateProjectRequest,
  ) => {
    try {
      setLoading(true);

      const data = await updateProject(
        uuid,
        payload,
      );

      notify.success(
        "Project updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update project.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (uuid: string) => {
    try {
      setLoading(true);

      await deleteProject(uuid);

      notify.success(
        "Project deleted successfully.",
      );

      setProjects((prev) =>
        prev.filter(
          (project) => project.uuid !== uuid,
        ),
      );

      setTotal((prev) =>
        prev > 0 ? prev - 1 : 0,
      );
    } catch (error) {
      notify.error(
        "Failed to delete project.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    loading,

    projects,
    total,
    selectedProject,

    formData,
    setFormData,

    fetchProjects,
    fetchProject,

    create,
    update,
    remove,

    resetForm,
  };
};