import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProjectTaskReportAttachmentViewUrl,
} from "../../api/project-task.api";

import {
  SIGNED_URL_GC_TIME,
  SIGNED_URL_STALE_TIME,
} from "./project-task-activity.constants";


export const getAttachmentQueryKey = (
  projectUuid: string,
  taskUuid: string,
  attachmentUuid: string,
) =>
  [
    "project-task-report-attachment-view-url",
    projectUuid,
    taskUuid,
    attachmentUuid,
  ] as const;


export const useSignedAttachmentUrl = (
  projectUuid: string,
  taskUuid: string,
  attachmentUuid: string,
) => {
  return useQuery({
    queryKey:
      getAttachmentQueryKey(
        projectUuid,
        taskUuid,
        attachmentUuid,
      ),

    queryFn: () =>
      getProjectTaskReportAttachmentViewUrl(
        projectUuid,
        taskUuid,
        attachmentUuid,
      ),

    staleTime:
      SIGNED_URL_STALE_TIME,

    gcTime:
      SIGNED_URL_GC_TIME,

    retry: 1,

    refetchOnWindowFocus:
      true,
  });
};