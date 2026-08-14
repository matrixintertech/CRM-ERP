import api from "@/shared/services/axios";

import type {
  CreatePlatformUserDto,
  PlatformUser,
  PlatformUserDetailsResponse,
  PlatformUserListResponse,
  UpdatePlatformUserDto,
} from "../types/platform-user.types";


interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}


const BASE_URL = "/platform/users";


export const getPlatformUsers = async (): Promise<PlatformUser[]> => {
  const { data } =
    await api.get<ApiResponse<PlatformUserListResponse>>(
      BASE_URL,
    );

  return data.data.users;
};


export const getPlatformUserByUuid = async (
  uuid: string,
): Promise<PlatformUser> => {
  const { data } =
    await api.get<ApiResponse<PlatformUserDetailsResponse>>(
      `${BASE_URL}/${uuid}`,
    );

  return data.data.user;
};


export const createPlatformUser = async (
  payload: CreatePlatformUserDto,
): Promise<PlatformUser> => {
  const { data } =
    await api.post<ApiResponse<PlatformUserDetailsResponse>>(
      BASE_URL,
      payload,
    );

  return data.data.user;
};


export const updatePlatformUser = async (
  uuid: string,
  payload: UpdatePlatformUserDto,
): Promise<PlatformUser> => {
  const { data } =
    await api.patch<ApiResponse<PlatformUserDetailsResponse>>(
      `${BASE_URL}/${uuid}`,
      payload,
    );

  return data.data.user;
};


export const deletePlatformUser = async (
  uuid: string,
): Promise<void> => {
  await api.delete(
    `${BASE_URL}/${uuid}`,
  );
};