import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createPermission,
  deletePermission,
  getGroupedPermissions,
  getPermission,
  getPermissions,
  updatePermission,
} from "../api/permission.api";

import type {
  CreatePermissionDto,
  Permission,
  PermissionGroup,
  UpdatePermissionDto,
} from "../types/permission.types";

export const usePermission = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    permissions,
    setPermissions,
  ] = useState<Permission[]>([]);

  const [
    groupedPermissions,
    setGroupedPermissions,
  ] = useState<PermissionGroup[]>(
    [],
  );

  const [
    selectedPermission,
    setSelectedPermission,
  ] = useState<Permission | null>(
    null,
  );

  const fetchPermissions =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getPermissions();

        setPermissions(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error) {
        notify.error(
          "Failed to load permissions.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchGroupedPermissions =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getGroupedPermissions();

        setGroupedPermissions(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error) {
        notify.error(
          "Failed to load grouped permissions.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchPermission =
    useCallback(
      async (
        id: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getPermission(
              id,
            );

          setSelectedPermission(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            "Failed to load permission.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create = async (
    payload: CreatePermissionDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await createPermission(
          payload,
        );

      notify.success(
        "Permission created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create permission.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    payload: UpdatePermissionDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await updatePermission(
          id,
          payload,
        );

      notify.success(
        "Permission updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update permission.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    id: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await deletePermission(
          id,
        );

      setPermissions(
        (previous) =>
          previous.filter(
            (permission) =>
              String(
                permission.id,
              ) !== id,
          ),
      );

      notify.success(
        "Permission deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to delete permission.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    permissions,
    groupedPermissions,
    selectedPermission,

    fetchPermissions,
    fetchGroupedPermissions,
    fetchPermission,

    create,
    update,
    remove,
  };
};