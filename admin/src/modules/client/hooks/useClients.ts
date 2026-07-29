import { useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createClient,
  deleteClient,
  getClientByUuid,
  getClients,
  updateClient,
} from "../api/client.api";

import type {
  Client,
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

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);

  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] =
    useState<CreateClientDto>(initialFormData);

  const fetchClients = async (
    params?: ClientQueryParams,
  ): Promise<ClientListResponse> => {
    try {
      setLoading(true);

      const data = await getClients(params ?? {});

      setClients(data.clients);
      setTotal(data.total);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchClient = async (uuid: string) => {
    const data = await getClientByUuid(uuid);

    setSelectedClient(data);

    return data;
  };

  const create = async (
    payload: CreateClientDto,
  ) => {
    try {
      setLoading(true);

      const data = await createClient(payload);

      notify.success(
        "Client created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create client.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateClientDto,
  ) => {
    try {
      setLoading(true);

      const data = await updateClient(
        uuid,
        payload,
      );

      notify.success(
        "Client updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update client.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (uuid: string) => {
    try {
      setLoading(true);

      await deleteClient(uuid);

      notify.success(
        "Client deleted successfully.",
      );

      // Optional: local state se remove bhi kar do
      setClients((prev) =>
        prev.filter(
          (client) => client.uuid !== uuid,
        ),
      );

      setTotal((prev) =>
        prev > 0 ? prev - 1 : 0,
      );
    } catch (error) {
      notify.error(
        "Failed to delete client.",
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

    clients,
    total,
    selectedClient,

    formData,
    setFormData,

    fetchClients,
    fetchClient,

    create,
    update,
    remove,

    resetForm,
  };
};