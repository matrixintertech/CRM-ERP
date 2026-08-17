import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createMyTaskReport,
  getMyTasks,
  requestMyTaskCompletion,
  startMyTaskWork,
  stopMyTaskWork,
} from "../api/my-task.api";

import type {
  ProjectTaskReportType,
} from "../api/my-task.api";


export const MY_TASKS_QUERY_KEY = [
  "my-tasks",
] as const;


interface TaskWorkVariables {
  projectUuid: string;
  taskUuid: string;
}


interface TaskReportVariables {
  projectUuid: string;
  taskUuid: string;

  type:
    ProjectTaskReportType;

  message:
    string;
}


interface TaskCompletionVariables {
  projectUuid: string;
  taskUuid: string;
  message: string;
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


const getReportSuccessMessage = (
  type:
    ProjectTaskReportType,
) => {
  switch (type) {
    case "PROGRESS":
      return "Progress update added successfully.";

    case "BLOCKER":
      return "Blocker reported successfully.";

    case "NOTE":
      return "Note added successfully.";

    default:
      return "Task report added successfully.";
  }
};


export const useMyTasks =
  () => {
    const queryClient =
      useQueryClient();


    const invalidateMyTasks =
      async () => {
        await queryClient
          .invalidateQueries({
            queryKey:
              MY_TASKS_QUERY_KEY,
          });
      };


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

            await invalidateMyTasks();
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

            await invalidateMyTasks();
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


    const reportMutation =
      useMutation({
        mutationFn: ({
          projectUuid,
          taskUuid,
          type,
          message,
        }: TaskReportVariables) =>
          createMyTaskReport(
            projectUuid,
            taskUuid,
            {
              type,

              message,
            },
          ),

        onSuccess:
          async (
            _response,
            variables,
          ) => {
            notify.success(
              getReportSuccessMessage(
                variables.type,
              ),
            );

            await invalidateMyTasks();
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to add task report.",
            ),
          );
        },
      });


    const completionMutation =
      useMutation({
        mutationFn: ({
          projectUuid,
          taskUuid,
          message,
        }: TaskCompletionVariables) =>
          requestMyTaskCompletion(
            projectUuid,
            taskUuid,
            message,
          ),

        onSuccess:
          async () => {
            notify.success(
              "Completion request submitted successfully.",
            );

            await invalidateMyTasks();
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to request task completion.",
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


      addReport: (
        projectUuid: string,
        taskUuid: string,
        type:
          ProjectTaskReportType,
        message: string,
      ) =>
        reportMutation
          .mutateAsync({
            projectUuid,
            taskUuid,
            type,
            message,
          }),


      requestCompletion: (
        projectUuid: string,
        taskUuid: string,
        message: string,
      ) =>
        completionMutation
          .mutateAsync({
            projectUuid,
            taskUuid,
            message,
          }),


      starting:
        startMutation.isPending,

      stopping:
        stopMutation.isPending,

      reporting:
        reportMutation.isPending,

      requestingCompletion:
        completionMutation.isPending,
    };
  };