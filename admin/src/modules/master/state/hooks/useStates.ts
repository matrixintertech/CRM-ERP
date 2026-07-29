import { useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createState,
  deleteState,
  getState,
  getStateDropdown,
  getStates,
  updateState,
} from "../api/state.api";

import type {
  State,
  StateDropdown,
  StateFormData,
  StateQueryParams,
} from "../types/state.types";

const initialFormData: StateFormData = {
  name: "",
  code: "",
  gstCode: "",
  status: "ACTIVE",
};

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [dropdown, setDropdown] = useState<
    StateDropdown[]
  >([]);
  const [selectedState, setSelectedState] =
    useState<State | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<StateFormData>(
      initialFormData,
    );

  const fetchStates = async (
    params?: StateQueryParams,
  ) => {
    try {
      setLoading(true);

      const data = await getStates(params);

      setStates(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdown = async () => {
    const data =
      await getStateDropdown();

    setDropdown(data);

    return data;
  };

  const fetchState = async (
    uuid: string,
  ) => {
    const data = await getState(uuid);

    setSelectedState(data);

    return data;
  };

  const create = async (
    payload: StateFormData,
  ) => {
    try {
      setLoading(true);

      console.log(payload);

      const data = await createState(
        payload,
      );

      notify.success(
        "State created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create state.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: Partial<StateFormData>,
  ) => {
    try {
      setLoading(true);

      const data = await updateState(
        uuid,
        payload,
      );

      notify.success(
        "State updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update state.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    uuid: string,
  ) => {
    try {
      setLoading(true);

      const data = await deleteState(
        uuid,
      );

      notify.success(
        "State deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to delete state.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    loading,

    states,
    dropdown,
    selectedState,

    formData,
    setFormData,

    fetchStates,
    fetchDropdown,
    fetchState,

    create,
    update,
    remove,

    resetForm,
  };
};