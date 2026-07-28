import { useState } from "react";

import {
  createOrganizationUnit,
  getOrganizationUnits,
} from "../api/organization-unit.api";

export const useOrganizationUnits = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    organizationUnits,
    setOrganizationUnits,
  ] = useState<any[]>([]);

  const fetchOrganizationUnits =
    async (companyId: string) => {
      setLoading(true);

      try {
        const data =
          await getOrganizationUnits(
            companyId,
          );

        setOrganizationUnits(data);
      } finally {
        setLoading(false);
      }
    };

  const create = async (
    payload: any,
  ) => {
    setLoading(true);

    try {
      const response =
        await createOrganizationUnit(
          payload,
        );

      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    organizationUnits,

    fetchOrganizationUnits,

    create,
  };
};