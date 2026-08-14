import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../api/module.api";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";


export const PLATFORM_MODULES_QUERY_KEY = [
  "platform-modules",
] as const;


interface ApiErrorResponse {
  message?: string;

  errors?:
    | string
    | string[];
}


const getErrorMessage = (
  error: unknown,
  fallbackMessage =
    "Something went wrong.",
): string => {
  const apiError =
    error as {
      response?: {
        data?: ApiErrorResponse;
      };
    };

  const errors =
    apiError.response?.data
      ?.errors;

  if (
    Array.isArray(
      errors,
    ) &&
    errors.length > 0
  ) {
    return errors.join(
      "\n",
    );
  }

  if (
    typeof errors ===
    "string"
  ) {
    return errors;
  }

  return (
    apiError.response?.data
      ?.message ??
    fallbackMessage
  );
};


export const useModule = () => {
  const queryClient =
    useQueryClient();


  const modulesQuery =
    useQuery({
      queryKey:
        PLATFORM_MODULES_QUERY_KEY,

      queryFn:
        getModules,

      staleTime:
        5 * 60 * 1000,
    });


  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          ModuleFormData,
      ) =>
        createModule(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Module created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey:
            PLATFORM_MODULES_QUERY_KEY,
        });
      },

      onError: (
        error,
      ) => {
        console.error(
          "Failed to create module:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create module.",
          ),
        );
      },
    });


  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;

        payload:
          Partial<ModuleFormData>;
      }) =>
        updateModule(
          id,
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Module updated successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey:
            PLATFORM_MODULES_QUERY_KEY,
        });
      },

      onError: (
        error,
      ) => {
        console.error(
          "Failed to update module:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update module.",
          ),
        );
      },
    });


  const deleteMutation =
    useMutation({
      mutationFn: (
        id: string,
      ) =>
        deleteModule(
          id,
        ),

      onSuccess: async (
        response,
      ) => {
        notify.success(
          response?.message ??
            "Module deleted successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey:
            PLATFORM_MODULES_QUERY_KEY,
        });
      },

      onError: (
        error,
      ) => {
        console.error(
          "Failed to delete module:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete module.",
          ),
        );
      },
    });


  const fetchModules =
    async (): Promise<Module[]> => {
      try {
        return await queryClient.fetchQuery({
          queryKey:
            PLATFORM_MODULES_QUERY_KEY,

          queryFn:
            getModules,

          staleTime:
            5 * 60 * 1000,
        });
      } catch (
        error
      ) {
        console.error(
          "Failed to fetch modules:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load modules.",
          ),
        );

        throw error;
      }
    };


  return {
    modules:
      modulesQuery.data ??
      [],

    loading:
      modulesQuery.isLoading,

    fetching:
      modulesQuery.isFetching,

    error:
      modulesQuery.error,

    refetch:
      modulesQuery.refetch,

    fetchModules,

    create:
      createMutation.mutateAsync,

    update: (
      id: string,
      payload:
        Partial<ModuleFormData>,
    ) =>
      updateMutation.mutateAsync({
        id,
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