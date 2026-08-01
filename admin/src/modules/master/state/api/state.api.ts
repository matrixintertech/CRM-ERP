import api from "@/shared/services/axios";

import type {
  State,
  StateFormData,
  StateQueryParams,
} from "../types/state.types";

interface StateListApiResponse {
  data: {
    states: State[];
  };
}

interface StateDetailsApiResponse {
  data: {
    state: State;
  };
}

interface StateMutationApiResponse {
  message?: string;
  data?: {
    state?: State;
  };
}

export const createState = async (
  payload: StateFormData,
): Promise<StateMutationApiResponse> => {
  const { data } =
    await api.post<StateMutationApiResponse>(
      "/master/states",
      payload,
    );

  return data;
};

export const getStates = async (
  params?: StateQueryParams,
): Promise<State[]> => {
  const { data } =
    await api.get<StateListApiResponse>(
      "/master/states",
      {
        params,
      },
    );

  return data.data.states;
};

export const getState = async (
  uuid: string,
): Promise<State> => {
  const { data } =
    await api.get<StateDetailsApiResponse>(
      `/master/states/${uuid}`,
    );

  return data.data.state;
};

export const getStateDropdown =
  async (): Promise<State[]> => {
    const { data } =
      await api.get<StateListApiResponse>(
        "/master/states/dropdown",
      );

    return data.data.states;
  };

export const updateState = async (
  uuid: string,
  payload: Partial<StateFormData>,
): Promise<StateMutationApiResponse> => {
  const { data } =
    await api.patch<StateMutationApiResponse>(
      `/master/states/${uuid}`,
      payload,
    );

  return data;
};

export const deleteState = async (
  uuid: string,
): Promise<StateMutationApiResponse> => {
  const { data } =
    await api.delete<StateMutationApiResponse>(
      `/master/states/${uuid}`,
    );

  return data;
};