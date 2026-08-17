import api from "@/shared/services/axios";


interface ApiResponse<T> {
  data: T;
}


export type TaskCompletionDecision =
  | "APPROVED"
  | "REJECTED";


export interface ReviewTaskCompletionPayload {
  decision:
    TaskCompletionDecision;

  reviewNote?:
    string;
}


export interface ReviewTaskCompletionResponse {
  message:
    string;

  task: {
    uuid:
      string;

    status:
      | "COMPLETED"
      | "IN_PROGRESS";

    completedAt?:
      string | null;

    updatedAt:
      string;
  };

  completionRequest: {
    uuid:
      string;

    status:
      | "APPROVED"
      | "REJECTED";

    workedSeconds:
      number;

    requestedAt:
      string;

    reviewedAt:
      string | null;

    reviewNote:
      string | null;

    report?: {
      uuid:
        string;

      type:
        "COMPLETION";

      message:
        string;

      taskStatusSnapshot:
        string;

      createdAt:
        string;
    } | null;
  };
}


/*
 * Manager:
 * Approve / reject employee
 * completion request.
 *
 * Permission:
 * company.task.update
 */
export const reviewTaskCompletion =
  async (
    projectUuid: string,
    taskUuid: string,
    payload:
      ReviewTaskCompletionPayload,
  ): Promise<
    ReviewTaskCompletionResponse
  > => {
    const {
      data,
    } =
      await api.post<
        ApiResponse<
          ReviewTaskCompletionResponse
        >
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/review-completion`,
        payload,
      );


    return data.data;
  };