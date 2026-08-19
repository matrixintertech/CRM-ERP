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
  uploadMyTaskReportImage,
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

  /*
   * Optional selected/captured images.
   *
   * Actual upload hook mutation ke
   * andar R2/S3 par hoga.
   */
  files?:
    File[];
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

      message?:
        string;
    };


  return (
    apiError.response
      ?.data?.message ??
    apiError.message ??
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


    /*
     * =========================================================
     * START WORK
     * =========================================================
     */
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


    /*
     * =========================================================
     * STOP WORK
     * =========================================================
     */
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


    /*
     * =========================================================
     * TASK REPORT + IMAGE UPLOAD
     * =========================================================
     *
     * Flow:
     *
     * selected File[]
     *      ↓
     * presigned upload URL
     *      ↓
     * direct R2/S3 PUT
     *      ↓
     * uploaded attachment metadata
     *      ↓
     * create report
     */
    const reportMutation =
      useMutation({
        mutationFn:
          async ({
            projectUuid,
            taskUuid,
            type,
            message,
            files = [],
          }: TaskReportVariables) => {
            /*
             * Defensive frontend limit.
             *
             * Backend also enforces max 5,
             * so this is UX validation only.
             */
            if (
              files.length >
              5
            ) {
              throw new Error(
                "A maximum of 5 images can be attached to a report.",
              );
            }


            /*
             * Upload selected images first.
             *
             * Promise.all means independent
             * images can upload concurrently.
             */
            const attachments =
              await Promise.all(
                files.map(
                  (
                    file,
                  ) =>
                    uploadMyTaskReportImage(
                      taskUuid,
                      file,
                    ),
                ),
              );


            /*
             * Only after every image upload
             * succeeds do we submit the report.
             *
             * Backend will HEAD-verify all
             * storage objects before DB save.
             */
            return createMyTaskReport(
              projectUuid,
              taskUuid,
              {
                type,

                message,

                ...(attachments.length >
                  0 && {
                  attachments,
                }),
              },
            );
          },

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


    /*
     * =========================================================
     * REQUEST COMPLETION
     * =========================================================
     */
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


      /*
       * files optional hain.
       *
       * Existing calls without images:
       *
       * addReport(
       *   projectUuid,
       *   taskUuid,
       *   "NOTE",
       *   message,
       * )
       *
       * still work.
       */
      addReport: (
        projectUuid: string,
        taskUuid: string,
        type:
          ProjectTaskReportType,
        message: string,
        files?:
          File[],
      ) =>
        reportMutation
          .mutateAsync({
            projectUuid,
            taskUuid,
            type,
            message,
            files,
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

      /*
       * reporting true rahega during:
       *
       * - presigned URL generation
       * - R2 uploads
       * - final report creation
       */
      reporting:
        reportMutation.isPending,

      requestingCompletion:
        completionMutation.isPending,
    };
  };