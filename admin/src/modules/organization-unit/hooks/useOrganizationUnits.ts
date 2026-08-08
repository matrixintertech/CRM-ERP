import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createOrganizationUnit,
  deleteOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnits,
  updateOrganizationUnit,
} from "../api/organization-unit.api";

import type {
  OrganizationUnitQueryParams,
  OrganizationUnitFormData,
  UpdateOrganizationUnitDto,
} from "../types/organization-unit.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
          errors?: string[];
        };
      };
    };

  const errors =
    apiError.response?.data
      ?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(
      ", ",
    );
  }

  return (
    apiError.response?.data
      ?.message ??
    fallbackMessage
  );
};

export const useOrganizationUnits = (
  params: OrganizationUnitQueryParams = {},
) => {
  const queryClient =
    useQueryClient();

  const organizationUnitsQuery =
    useQuery({
      queryKey: [
        "organization-units",
        params,
      ],

      queryFn: () =>
        getOrganizationUnits(
          params,
        ),

      staleTime:
        5 * 60 * 1000,
    });

  const fetchOrganizationUnit =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "organization-unit",
            uuid,
          ],

          queryFn: () =>
            getOrganizationUnit(
              uuid,
            ),
        });
      } catch (error) {
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
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          OrganizationUnitFormData,
      ) =>
        createOrganizationUnit(
          payload,
        ),

      onSuccess: async (
        response,
      ) => {
        notify.success(
          response?.message ??
            "Organization unit created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "organization-units",
          ],
        });
      },

      onError: (error) => {
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
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          UpdateOrganizationUnitDto;
      }) =>
        updateOrganizationUnit(
          uuid,
          payload,
        ),

      onSuccess: async (
        response,
        variables,
      ) => {
        notify.success(
          response?.message ??
            "Organization unit updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "organization-units",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "organization-unit",
              variables.uuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
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
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deleteOrganizationUnit(
          uuid,
        ),

      onSuccess: async (
        response,
        uuid,
      ) => {
        notify.success(
          response?.message ??
            "Organization unit deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "organization-unit",
            uuid,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "organization-units",
          ],
        });
      },

      onError: (error) => {
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
      },
    });

  const organizationUnitsResponse =
    organizationUnitsQuery.data;

  const organizationUnits =
    Array.isArray(
      organizationUnitsResponse,
    )
      ? organizationUnitsResponse
      : organizationUnitsResponse
          ?.organizationUnits ??
        [];

  return {
    organizationUnits,

    loading:
      organizationUnitsQuery.isLoading,

    fetching:
      organizationUnitsQuery.isFetching,

    error:
      organizationUnitsQuery.error,

    refetch:
      organizationUnitsQuery.refetch,

    fetchOrganizationUnit,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        UpdateOrganizationUnitDto,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove:
      deleteMutation.mutateAsync,

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,
  };
};