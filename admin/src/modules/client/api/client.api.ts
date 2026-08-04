import api from "@/shared/services/axios";

import type {
  Client,
  ClientDropdown,
  ClientListResponse,
  ClientQueryParams,
  CreateClientDto,
  UpdateClientDto,
} from "../types/client.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Get Clients
 */
export const getClients = async (
  params: ClientQueryParams,
): Promise<ClientListResponse> => {
  const { data } = await api.get<
    ApiResponse<ClientListResponse>
  >("/clients", {
    params,
  });

  return data.data;
};

/**
 * Get Client By UUID
 */
interface ClientDetailsResponse {
  client: Client;
}

/**
 * Get Client By UUID
 */
export const getClientByUuid = async (
  uuid: string,
): Promise<Client> => {
  const { data } = await api.get<
    ApiResponse<ClientDetailsResponse>
  >(`/clients/${uuid}`);

  return data.data.client;
};

/**
 * Create Client
 */
export const createClient = async (
  payload: CreateClientDto,
): Promise<Client> => {
  const { data } = await api.post<
    ApiResponse<Client>
  >("/clients", payload);

  return data.data;
};

/**
 * Update Client
 */
export const updateClient = async (
  uuid: string,
  payload: UpdateClientDto,
): Promise<Client> => {
  const { data } = await api.patch<
    ApiResponse<Client>
  >(`/clients/${uuid}`, payload);

  return data.data;
};

/**
 * Delete Client
 */
export const deleteClient = async (
  uuid: string,
): Promise<void> => {
  await api.delete(`/clients/${uuid}`);
};

/**
 * Client Dropdown
 */
export const getClientDropdown =
  async (): Promise<ClientDropdown[]> => {
    const { data } = await api.get<
      ApiResponse<ClientDropdown[]>
    >("/clients/dropdown");

    return data.data;
  };