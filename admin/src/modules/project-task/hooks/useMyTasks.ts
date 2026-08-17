import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getMyTasks,
  startMyTaskWork,
  stopMyTaskWork,
} from "../api/my-task.api";


export const MY_TASKS_QUERY_KEY = [
  "my-tasks",
] as const;


interface TaskWorkVariables {
  projectUuid: string;
  taskUuid: string;
}


const getErrorMessage = (
  error: unknown,
  fallback:
    string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?:
            string;
        };
      };
    };

  return (
    apiError.response
      ?.data?.message ??
    fallback
  );
};


export const useMyTasks =
  () => {
    const queryClient =
      useQueryClient();


    const tasksQuery =
      useQuery({
        queryKey:
          MY_TASKS_QUERY_KEY,

        queryFn:
          getMyTasks,

        staleTime:
          60 * 1000,
      });


    const startMutation =
      useMutation({
        mutationFn: ({
          projectUuid,
          taskUuid,
        }: TaskWorkVariables) =>
          startMyTaskWork(
            projectUuid,
            taskUuid,
          ),

        onSuccess:
          async () => {
            notify.success(
              "Work started successfully.",
            );

            await queryClient
              .invalidateQueries({
                queryKey:
                  MY_TASKS_QUERY_KEY,
              });
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to start work.",
            ),
          );
        },
      });


    const stopMutation =
      useMutation({
        mutationFn: ({
          projectUuid,
          taskUuid,
        }: TaskWorkVariables) =>
          stopMyTaskWork(
            projectUuid,
            taskUuid,
          ),

        onSuccess:
          async () => {
            notify.success(
              "Work stopped successfully.",
            );

            await queryClient
              .invalidateQueries({
                queryKey:
                  MY_TASKS_QUERY_KEY,
              });
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to stop work.",
            ),
          );
        },
      });


    return {
      tasks:
        tasksQuery.data ??
        [],

      loading:
        tasksQuery.isLoading,

      fetching:
        tasksQuery.isFetching,

      error:
        tasksQuery.error,

      refetch:
        tasksQuery.refetch,


      startWork: (
        projectUuid: string,
        taskUuid: string,
      ) =>
        startMutation
          .mutateAsync({
            projectUuid,
            taskUuid,
          }),


      stopWork: (
        projectUuid: string,
        taskUuid: string,
      ) =>
        stopMutation
          .mutateAsync({
            projectUuid,
            taskUuid,
          }),


      starting:
        startMutation.isPending,

      stopping:
        stopMutation.isPending,
    };
  };