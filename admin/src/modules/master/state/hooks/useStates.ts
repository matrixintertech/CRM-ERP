import {
  useCallback,
  useState,
} from "react";

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

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useStates = () => {
  const [states, setStates] =
    useState<State[]>([]);

  const [dropdown, setDropdown] =
    useState<StateDropdown[]>([]);

  const [
    selectedState,
    setSelectedState,
  ] = useState<State | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<StateFormData>(
      () => ({
        ...initialFormData,
      }),
    );

  const fetchStates = useCallback(
    async (
      params?: StateQueryParams,
    ) => {
      try {
        setLoading(true);

        const data =
          await getStates(params);

        setStates(data);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch states:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load states.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchDropdown = useCallback(
    async () => {
      try {
        const data =
          await getStateDropdown();

        setDropdown(data);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch state dropdown:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load state dropdown.",
          ),
        );

        throw error;
      }
    },
    [],
  );

  const fetchState = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true);

        const data =
          await getState(uuid);

        setSelectedState(data);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load state details.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const create = useCallback(
    async (
      payload: StateFormData,
    ) => {
      try {
        setLoading(true);

        const data =
          await createState(payload);

        notify.success(
          data?.message ??
            "State created successfully.",
        );

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to create state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create state.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      uuid: string,
      payload: Partial<StateFormData>,
    ) => {
      try {
        setLoading(true);

        const data =
          await updateState(
            uuid,
            payload,
          );

        notify.success(
          data?.message ??
            "State updated successfully.",
        );

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to update state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update state.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true);

        const data =
          await deleteState(uuid);

        notify.success(
          data?.message ??
            "State deleted successfully.",
        );

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to delete state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete state.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData({
      ...initialFormData,
    });
  }, []);

  const clearSelectedState =
    useCallback(() => {
      setSelectedState(null);
    }, []);

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
    clearSelectedState,
  };
};