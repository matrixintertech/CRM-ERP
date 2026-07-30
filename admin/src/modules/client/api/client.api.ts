import api from "@/shared/services/axios";

import type {
  Client,
  ClientListResponse,
  ClientQueryParams,
  CreateClientDto,
  UpdateClientDto,
  ClientDropdown
} from '../types/client.types';


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
  const { data } = await api.get<ApiResponse<ClientListResponse>>(
    '/clients',
    {
      params,
    },
  );

  return data.data;
};

/**
 * Get Client By UUID
 */
export const getClientByUuid = async (
  uuid: string,
): Promise<Client> => {
  const { data } = await api.get<ApiResponse<Client>>(
    `/clients/${uuid}`,
  );

  return data.data;
};

/**
 * Create Client
 */
export const createClient = async (
  payload: CreateClientDto,
): Promise<Client> => {
  const { data } = await api.post<ApiResponse<Client>>(
    '/clients',
    payload,
  );

  return data.data;
};

/**
 * Update Client
 */
export const updateClient = async (
  uuid: string,
  payload: UpdateClientDto,
): Promise<Client> => {
  try {
    console.log("Update UUID:", uuid);
    console.log("Update Payload:", payload);

    const { data } = await api.patch<ApiResponse<Client>>(
      `/clients/${uuid}`,
      payload,
    );

    return data.data;
  } catch (error: any) {
  //    console.log(error.response?.data);
  // console.log(error.response?.data.errors);
  // console.log(JSON.stringify(error.response?.data, null, 2));
  // throw error;
  }
};

/**
 * Delete Client
 */
export const deleteClient = async (
  uuid: string,
): Promise<void> => {
  await api.delete(`/clients/${uuid}`);
};


export const getClientDropdown = async () => {
  const { data } = await api.get<
    ApiResponse<ClientDropdown[]>
  >("/clients/dropdown");

  return data.data;
};