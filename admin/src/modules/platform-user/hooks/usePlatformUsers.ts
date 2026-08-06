import axios from "axios";

import { useCallback, useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createPlatformUser,
  deletePlatformUser,
  getPlatformUserByUuid,
  getPlatformUsers,
  updatePlatformUser,
} from "../api/platform-user.api";

import type {
  CreatePlatformUserDto,
  PlatformUser,
  UpdatePlatformUserDto,
} from "../types/platform-user.types";

interface ApiErrorResponse {
  message?: string;
  errors?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ?? error.response?.data?.errors ?? fallback
    );
  }

  return fallback;
};

export const usePlatformUsers = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);

  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPlatformUsers();

      setUsers(data);

      return data;
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to load platform users."));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (uuid: string) => {
    try {
      setLoading(true);

      const data = await getPlatformUserByUuid(uuid);

      setSelectedUser(data);

      return data;
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to load platform user."));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreatePlatformUserDto) => {
    try {
      setLoading(true);

      const data = await createPlatformUser(payload);

      notify.success("Platform user created successfully.");

      return data;
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to create platform user."));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (uuid: string, payload: UpdatePlatformUserDto) => {
      try {
        setLoading(true);

        const data = await updatePlatformUser(uuid, payload);

        notify.success("Platform user updated successfully.");

        return data;
      } catch (error) {
        notify.error(getErrorMessage(error, "Failed to update platform user."));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(async (uuid: string) => {
    try {
      setLoading(true);

      await deletePlatformUser(uuid);

      setUsers((previous) => previous.filter((user) => user.uuid !== uuid));

      notify.success("Platform user deleted successfully.");
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to delete platform user."));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return {
    users,
    selectedUser,
    loading,

    fetchUsers,
    fetchUser,

    create,
    update,
    remove,

    clearSelectedUser,
  };
};
