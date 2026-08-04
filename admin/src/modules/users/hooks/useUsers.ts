import {
  useCallback,
  useState,
} from "react";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getUsers,
  getUserByUuid,
  getUserPermissions,
  updateUserPermissions,
} from "../api/user.api";

import type {
  UpdateUserPermissionsDto,
  User,
  UserPermissions,
  UserQueryParams,
  UsersResponse,
} from "../types/user.types";

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
    apiError.response?.data
      ?.message ??
    fallbackMessage
  );
};

export const useUsers = () => {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    limit,
    setLimit,
  ] = useState(10);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [
    selectedUser,
    setSelectedUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    permissions,
    setPermissions,
  ] =
    useState<UserPermissions | null>(
      null,
    );

  const fetchUsers =
    useCallback(
      async (
        params: UserQueryParams = {},
      ) => {
        try {
          setLoading(true);

          const response:
            UsersResponse =
            await getUsers(
              params,
            );

          setUsers(
            response.users,
          );

          setTotal(
            response.total,
          );

          setPage(
            response.page,
          );

          setLimit(
            response.limit,
          );

          setTotalPages(
            response.totalPages,
          );

          return response;
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load users:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load users.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchUser =
    useCallback(
      async (
        uuid: string,
      ) => {
        try {
          setLoading(true);

          const user =
            await getUserByUuid(
              uuid,
            );

          setSelectedUser(
            user,
          );

          return user;
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load user:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load user.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchPermissions =
    useCallback(
      async (
        uuid: string,
      ) => {
        try {
          setLoading(true);

          const response =
            await getUserPermissions(
              uuid,
            );

          setPermissions(
            response,
          );

          return response;
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load user permissions:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load user permissions.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const savePermissions =
    useCallback(
      async (
        uuid: string,
        payload:
          UpdateUserPermissionsDto,
      ) => {
        try {
          setLoading(true);

          const response =
            await updateUserPermissions(
              uuid,
              payload,
            );

          setPermissions(
            response,
          );

          notify.success(
            "User permissions updated successfully.",
          );

          return response;
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to update user permissions:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to update user permissions.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const clearSelectedUser =
    useCallback(() => {
      setSelectedUser(
        null,
      );
    }, []);

  const clearPermissions =
    useCallback(() => {
      setPermissions(
        null,
      );
    }, []);

  return {
    loading,

    users,
    total,
    page,
    limit,
    totalPages,

    selectedUser,
    permissions,

    fetchUsers,
    fetchUser,
    fetchPermissions,
    savePermissions,

    clearSelectedUser,
    clearPermissions,
  };
};