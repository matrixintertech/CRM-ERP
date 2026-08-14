import {
  useQuery,
} from "@tanstack/react-query";

import {
  getCompanyGroupedPermissions,
} from "../api/company-permission.api";


export const COMPANY_GROUPED_PERMISSIONS_QUERY_KEY = [
  "company-grouped-permissions",
] as const;


export const useCompanyPermissions =
  () => {
    const query =
      useQuery({
        queryKey:
          COMPANY_GROUPED_PERMISSIONS_QUERY_KEY,

        queryFn:
          getCompanyGroupedPermissions,

        staleTime:
          5 * 60 * 1000,
      });

    return {
      groupedPermissions:
        query.data ?? [],

      loading:
        query.isLoading,

      fetching:
        query.isFetching,

      error:
        query.error,

      refetch:
        query.refetch,
    };
  };