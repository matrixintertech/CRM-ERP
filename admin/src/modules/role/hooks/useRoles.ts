import { useState } from "react";
import { notify } from "@/shared/utils/notify";

import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from "../api/role.api";

import type {
  Role,
  RoleFormData,
} from "../types/role.types";

export const useRoles = () => {
  const [loading, setLoading] =
    useState(false);

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<Role | null>(null);

  const fetchRoles = async (
    companyId: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await getRoles(companyId);

      setRoles(data);
    } finally {
      setLoading(false);
    }
  };

 const fetchRole = async (
  id: string,
) => {
  setLoading(true);

  try {
    const data =
      await getRole(id);

    setSelectedRole(data);

    return data; 
  } finally {
    setLoading(false);
  }
};

const create = async (
  payload: RoleFormData,
) => {
  setLoading(true);

  try {
    const data = await createRole(payload);

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
  id: string,
  payload: Partial<RoleFormData>,
) => {
  setLoading(true);

  try {
    const data = await updateRole(
      id,
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
  id: string,
) => {
  setLoading(true);

  try {
    const data = await deleteRole(id);

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

  return {
    loading,

    roles,

    selectedRole,

    fetchRoles,

    fetchRole,

    create,

    update,

    remove,
  };
};