import api from "@/shared/services/axios";

import type {
  StateFormData,
  StateQueryParams,
} from "../types/state.types";

export const createState = async (
  payload: StateFormData,
) => {
  const { data } = await api.post(
    "/master/states",
    payload,
  );

  return data;
};

export const getStates = async (
  params?: StateQueryParams,
) => {
  const { data } = await api.get(
    "/master/states",
    {
      params,
    },
  );

  return data.data.states;
};

export const getState = async (
  uuid: string,
) => {
  const { data } = await api.get(
    `/master/states/${uuid}`,
  );

  return data.data.state;
};

export const getStateDropdown =
  async () => {
    const { data } = await api.get(
      "/master/states/dropdown",
    );

    return data.data.states;
  };

export const updateState = async (
  uuid: string,
  payload: Partial<StateFormData>,
) => {
  const { data } = await api.patch(
    `/master/states/${uuid}`,
    payload,
  );

  return data;
};

export const deleteState = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/master/states/${uuid}`,
  );

  return data;
};