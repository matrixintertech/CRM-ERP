import api from "@/shared/services/axios";

import type {
  UpdateUserPermissionsDto,
  User,
  UserPermissions,
  UserQueryParams,
  UsersResponse,
} from "../types/user.types";

interface ApiResponse<T> {
  success: boolean;

  statusCode: number;

  message: string;

  data: T;

  timestamp: string;

  path: string;
}

/**
 * Get users with server-side
 * pagination, search, filters and sorting.
 */
export const getUsers = async (
  params:
    UserQueryParams = {},
): Promise<UsersResponse> => {
  const { data } =
    await api.get<
      ApiResponse<UsersResponse>
    >(
      "/users",
      {
        params,
      },
    );

  return data.data;
};

/**
 * Get user by UUID.
 */
export const getUserByUuid = async (
  userUuid: string,
): Promise<User> => {
  const { data } =
    await api.get<
      ApiResponse<{
        message: string;

        user: User;
      }>
    >(
      `/users/${userUuid}`,
    );

  return data.data.user;
};

/**
 * Get user role, additional
 * and effective permissions
 * including their scopes.
 */
export const getUserPermissions =
  async (
    userUuid: string,
  ): Promise<UserPermissions> => {
    const { data } =
      await api.get<
        ApiResponse<UserPermissions>
      >(
        `/users/${userUuid}/permissions`,
      );

    return data.data;
  };

/**
 * Replace user-specific
 * additional permissions
 * including their scopes.
 */
export const updateUserPermissions =
  async (
    userUuid: string,

    payload:
      UpdateUserPermissionsDto,
  ): Promise<UserPermissions> => {
    const { data } =
      await api.put<
        ApiResponse<UserPermissions>
      >(
        `/users/${userUuid}/permissions`,

        payload,
      );

    return data.data;
  };