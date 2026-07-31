import { useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnits,
  updateOrganizationUnit,
} from "../api/organization-unit.api";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
  UpdateOrganizationUnitDto,
} from "../types/organization-unit.types";

export const useOrganizationUnits = () => {
  const [loading, setLoading] =
    useState(false);

const [
  organizationUnits,
  setOrganizationUnits,
] = useState<OrganizationUnit[]>([]);

const [
  selectedOrganizationUnit,
  setSelectedOrganizationUnit,
] = useState<OrganizationUnit | null>(null);

const fetchOrganizationUnits = async () => {
  setLoading(true);

  try {
    const data =
      await getOrganizationUnits();

    setOrganizationUnits(data);

    return data;
  } catch (error: any) {
    notify.error(
      error?.response?.data?.message ??
        "Failed to load Organization Units."
    );

    throw error;
  } finally {
    setLoading(false);
  }
};

const create = async (
  payload: OrganizationUnitFormData,
) => {
  setLoading(true);

  try {
    const response =
      await createOrganizationUnit(payload);

   notify.success(
    response.data?.message ??
    "Organization Unit created successfully."
);

    return response;
  } catch (error: any) {
    notify.error(
      error?.response?.data?.message ??
        "Failed to create Organization Unit."
    );

    throw error;
  } finally {
    setLoading(false);
  }
};


const update = async (
  id: number,
  payload: UpdateOrganizationUnitDto,
) => {
  setLoading(true);

  try {
    const response =
      await updateOrganizationUnit(
        id,
        payload,
      );

     notify.success(
      response.data?.message ??
        "Organization Unit updated successfully."
    );

    return response;
  } catch (error: any) {
    notify.error(
      error?.response?.data?.message ??
        "Failed to update Organization Unit."
    );

    throw error;
  } finally {
    setLoading(false);
  }
};


const fetchOrganizationUnit = async (
  id: number,
) => {
  setLoading(true);

  try {
    const unit =
      await getOrganizationUnit(id);

    setSelectedOrganizationUnit(unit);

    return unit;
  } catch (error: any) {
    notify.error(
      error?.response?.data?.message ??
        "Failed to load Organization Unit."
    );

    throw error;
  } finally {
    setLoading(false);
  }
};

  return {
    loading,

    organizationUnits,

    fetchOrganizationUnits,
    fetchOrganizationUnit,

    create,
    update,
  };
};