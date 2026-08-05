import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createProject,
  deleteProject,
  getProjectByUuid,
  getProjects,
  updateProject,
} from "../api/project.api";

import type {
  CreateProjectRequest,
  Project,
  ProjectFormData,
  ProjectListResponse,
  ProjectQuery,
  UpdateProjectRequest,
} from "../types/project.types";

const initialFormData: ProjectFormData = {
  clientUuid: "",
  categoryUuid: "",
  organizationUnitUuid: "",

  name: "",

  stateUuid: "",
  cityUuid: "",

  address: "",
  pincode: "",

  startDate: "",
  expectedEndDate: "",

  remarks: "",

  status: "ACTIVE",
};

export const useProjects = () => {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [total, setTotal] =
    useState(0);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<Project | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<ProjectFormData>(() => ({
      ...initialFormData,
    }));

  const fetchProjects = useCallback(
    async (
      params: ProjectQuery = {},
    ): Promise<ProjectListResponse> => {
      try {
        setLoading(true);

        const data =
          await getProjects(params);

        setProjects(
          data.projects ?? [],
        );

        setTotal(
          data.total ?? 0,
        );

        return data;
      } catch (error) {
        notify.error(
          "Failed to load projects.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchProject = useCallback(
    async (
      uuid: string,
    ): Promise<Project> => {
      try {
        setLoading(true);

        const project =
          await getProjectByUuid(
            uuid,
          );

        setSelectedProject(
          project,
        );

        return project;
      } catch (error) {
        notify.error(
          "Failed to load project details.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const create = useCallback(
    async (
      payload:
        CreateProjectRequest,
    ) => {
      try {
        setLoading(true);

        const data =
          await createProject(
            payload,
          );

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
    },
    [],
  );

  const update = useCallback(
    async (
      uuid: string,
      payload:
        UpdateProjectRequest,
    ) => {
      try {
        setLoading(true);

        const data =
          await updateProject(
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
    },
    [],
  );

  const remove = useCallback(
    async (
      uuid: string,
    ) => {
      try {
        setLoading(true);

        await deleteProject(uuid);

        setProjects(
          (previous) =>
            previous.filter(
              (project) =>
                project.uuid !==
                uuid,
            ),
        );

        setTotal(
          (previous) =>
            Math.max(
              previous - 1,
              0,
            ),
        );

        notify.success(
          "Project deleted successfully.",
        );
      } catch (error) {
        notify.error(
          "Failed to delete project.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetForm =
    useCallback(() => {
      setFormData({
        ...initialFormData,
      });
    }, []);

  const clearSelectedProject =
    useCallback(() => {
      setSelectedProject(null);
    }, []);

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
    clearSelectedProject,
  };
};