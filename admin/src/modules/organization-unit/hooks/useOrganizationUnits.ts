import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createOrganizationUnit,
  deleteOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnits,
  updateOrganizationUnit,
} from "../api/organization-unit.api";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
  OrganizationUnitQueryParams,
  UpdateOrganizationUnitDto,
} from "../types/organization-unit.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useOrganizationUnits = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    organizationUnits,
    setOrganizationUnits,
  ] = useState<OrganizationUnit[]>([]);

  const [
    selectedOrganizationUnit,
    setSelectedOrganizationUnit,
  ] = useState<OrganizationUnit | null>(
    null,
  );

  const fetchOrganizationUnits =
    useCallback(
      async (
        params: OrganizationUnitQueryParams = {},
      ) => {
        try {
          setLoading(true);

          const response =
            await getOrganizationUnits(
              params,
            );

          const units =
            Array.isArray(response)
              ? response
              : response.organizationUnits ??
                [];

          setOrganizationUnits(units);

          return response;
        } catch (error: unknown) {
          console.error(
            "Failed to load organization units:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load organization units.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchOrganizationUnit =
    useCallback(
      async (uuid: string) => {
        try {
          setLoading(true);

          const unit =
            await getOrganizationUnit(
              uuid,
            );

          setSelectedOrganizationUnit(
            unit,
          );

          return unit;
        } catch (error: unknown) {
          console.error(
            "Failed to load organization unit:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load organization unit.",
            ),
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
      payload: OrganizationUnitFormData,
    ) => {
      try {
        setLoading(true);

        const response =
          await createOrganizationUnit(
            payload,
          );

        notify.success(
          response?.message ??
            "Organization unit created successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to create organization unit:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create organization unit.",
          ),
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
      payload: UpdateOrganizationUnitDto,
    ) => {
      try {
        setLoading(true);

        const response =
          await updateOrganizationUnit(
            uuid,
            payload,
          );

        notify.success(
          response?.message ??
            "Organization unit updated successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to update organization unit:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update organization unit.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true);

        const response =
          await deleteOrganizationUnit(
            uuid,
          );

        setOrganizationUnits(
          (previous) =>
            previous.filter(
              (unit) =>
                unit.uuid !== uuid,
            ),
        );

        notify.success(
          response?.message ??
            "Organization unit deleted successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to delete organization unit:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete organization unit.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearSelectedOrganizationUnit =
    useCallback(() => {
      setSelectedOrganizationUnit(
        null,
      );
    }, []);

  return {
    loading,

    organizationUnits,
    selectedOrganizationUnit,

    fetchOrganizationUnits,
    fetchOrganizationUnit,

    create,
    update,
    remove,

    clearSelectedOrganizationUnit,
  };
};