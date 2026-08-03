import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  assignRolePermissions,
  createRole,
  deleteRole,
  getRole,
  getRolePermissions,
  getRoles,
  updateRole,
} from "../api/role.api";

import type {
  AssignRolePermissionsDto,
  CreateRoleDto,
  Role,
  RolePermissionResponse,
  UpdateRoleDto,
} from "../types/role.types";

export const useRole = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    roles,
    setRoles,
  ] = useState<Role[]>([]);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<Role | null>(
    null,
  );

  const [
    selectedRolePermissions,
    setSelectedRolePermissions,
  ] =
    useState<RolePermissionResponse | null>(
      null,
    );

  const fetchRoles =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getRoles();

        setRoles(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error) {
        notify.error(
          "Failed to load roles.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchRole =
    useCallback(
      async (
        uuid: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getRole(uuid);

          setSelectedRole(data);

          return data;
        } catch (error) {
          notify.error(
            "Failed to load role.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchRolePermissions =
    useCallback(
      async (
        uuid: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getRolePermissions(
              uuid,
            );

          setSelectedRolePermissions(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            "Failed to load role permissions.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create = async (
    payload: CreateRoleDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await createRole(payload);

      notify.success(
        "Role created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create role.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateRoleDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateRole(
          uuid,
          payload,
        );

      notify.success(
        "Role updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update role.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    uuid: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await deleteRole(uuid);

      setRoles((previous) =>
        previous.filter(
          (role) =>
            role.uuid !== uuid,
        ),
      );

      notify.success(
        "Role deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to delete role.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignPermissions = async (
    uuid: string,
    payload: AssignRolePermissionsDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await assignRolePermissions(
          uuid,
          payload,
        );

      notify.success(
        "Role permissions updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update role permissions.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    roles,
    selectedRole,
    selectedRolePermissions,

    fetchRoles,
    fetchRole,
    fetchRolePermissions,

    create,
    update,
    remove,
    assignPermissions,
  };
};