import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createClient,
  deleteClient,
  getClientByUuid,
  getClientDropdown,
  getClients,
  updateClient,
} from "../api/client.api";

import type {
  Client,
  ClientDropdown,
  ClientListResponse,
  ClientQueryParams,
  CreateClientDto,
  UpdateClientDto,
} from "../types/client.types";

const initialFormData: CreateClientDto = {
  name: "",
  code: "",
  contactName: "",
  mobile: "",
  email: "",
  gstNumber: "",
  panNumber: "",
  stateUuid: "",
  cityUuid: "",
  address: "",
  pincode: "",
  remarks: "",
};

const getErrorMessage = (
  error: unknown,
  fallback: string,
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
    fallback
  );
};

export const useClients = () => {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [total, setTotal] =
    useState(0);

  const [
    selectedClient,
    setSelectedClient,
  ] = useState<Client | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState<CreateClientDto>(
      () => ({
        ...initialFormData,
      }),
    );

  const [dropdown, setDropdown] =
    useState<ClientDropdown[]>([]);

  const fetchClients = useCallback(
    async (
      params: ClientQueryParams = {},
    ): Promise<ClientListResponse> => {
      try {
        setLoading(true);

        const data =
          await getClients(params);

        setClients(
          data.clients ?? [],
        );

        setTotal(data.total ?? 0);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch clients:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load clients.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchClient = useCallback(
    async (
      uuid: string,
    ): Promise<Client> => {
      try {
        setLoading(true);

        const client =
          await getClientByUuid(uuid);

        setSelectedClient(client);

        return client;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch client:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load client details.",
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
      payload: CreateClientDto,
    ) => {
      try {
        setLoading(true);

        const data =
          await createClient(payload);

        notify.success(
          "Client created successfully.",
        );

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to create client:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create client.",
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
      payload: UpdateClientDto,
    ) => {
      try {
        setLoading(true);

        const data =
          await updateClient(
            uuid,
            payload,
          );

        notify.success(
          "Client updated successfully.",
        );

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to update client:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update client.",
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

        await deleteClient(uuid);

        setClients((previous) =>
          previous.filter(
            (client) =>
              client.uuid !== uuid,
          ),
        );

        setTotal((previous) =>
          Math.max(previous - 1, 0),
        );

        notify.success(
          "Client deleted successfully.",
        );
      } catch (error: unknown) {
        console.error(
          "Failed to delete client:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete client.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchDropdown =
    useCallback(async () => {
      try {
        const data =
          await getClientDropdown();

        setDropdown(data);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch client dropdown:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load client dropdown.",
          ),
        );

        throw error;
      }
    }, []);

  const resetForm = useCallback(() => {
    setFormData({
      ...initialFormData,
    });
  }, []);

  const clearSelectedClient =
    useCallback(() => {
      setSelectedClient(null);
    }, []);

  return {
    loading,

    clients,
    total,
    selectedClient,

    dropdown,
    fetchDropdown,

    formData,
    setFormData,

    fetchClients,
    fetchClient,

    create,
    update,
    remove,

    resetForm,
    clearSelectedClient,
  };
};