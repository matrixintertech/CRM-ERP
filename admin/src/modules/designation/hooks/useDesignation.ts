import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createDesignation,
  deleteDesignation,
  getDesignation,
  getDesignations,
  updateDesignation,
} from "../api/designation.api";

import type {
  Designation,
  DesignationFormData,
  UpdateDesignationDto,
} from "../types/designation.types";

export const useDesignation = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    designations,
    setDesignations,
  ] = useState<Designation[]>([]);

  const [
    selectedDesignation,
    setSelectedDesignation,
  ] = useState<Designation | null>(
    null,
  );

  const fetchDesignations =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getDesignations();

        setDesignations(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error: any) {
        notify.error(
          error?.response?.data
            ?.message ??
            "Failed to load designations.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchDesignation =
    useCallback(
      async (
        uuid: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getDesignation(
              uuid,
            );

          setSelectedDesignation(
            data,
          );

          return data;
        } catch (error: any) {
          notify.error(
            error?.response?.data
              ?.message ??
              "Failed to load designation.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create = async (
    payload: DesignationFormData,
  ) => {
    setLoading(true);

    try {
      const data =
        await createDesignation(
          payload,
        );

      notify.success(
        data?.message ??
          "Designation created successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to create designation.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateDesignationDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateDesignation(
          uuid,
          payload,
        );

      notify.success(
        data?.message ??
          "Designation updated successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to update designation.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    uuid: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await deleteDesignation(
          uuid,
        );

      setDesignations(
        (previous) =>
          previous.filter(
            (designation) =>
              designation.uuid !==
              uuid,
          ),
      );

      notify.success(
        data?.message ??
          "Designation deleted successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to delete designation.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    designations,
    selectedDesignation,

    fetchDesignations,
    fetchDesignation,

    create,
    update,
    remove,
  };
};