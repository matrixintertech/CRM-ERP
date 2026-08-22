import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createVendor,
  deleteVendor,
  getVendor,
  getVendorCategories,
  getVendors,
  updateVendor,
  updateVendorCategories,
} from "../api/vendor.api";

import type {
  CreateVendorDto,
  UpdateVendorCategoriesDto,
  UpdateVendorDto,
  VendorQueryParams,
} from "../types/vendor.types";


const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?:
            string;

          errors?:
            string[];
        };
      };
    };


  const errors =
    apiError.response
      ?.data
      ?.errors;


  if (
    Array.isArray(
      errors,
    ) &&
    errors.length >
      0
  ) {
    return errors.join(
      ", ",
    );
  }


  return (
    apiError.response
      ?.data
      ?.message ??
    fallbackMessage
  );
};


export const useVendors = (
  query:
    VendorQueryParams = {},
) => {
  const queryClient =
    useQueryClient();


  /*
   * =========================================================
   * VENDOR LIST
   * =========================================================
   */

  const vendorsQuery =
    useQuery({
      queryKey: [
        "vendors",
        query,
      ],

      queryFn: () =>
        getVendors(
          query,
        ),

      staleTime:
        2 * 60 * 1000,
    });


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreateVendorDto,
      ) =>
        createVendor(
          payload,
        ),

      onSuccess: async () => {
        await queryClient
          .invalidateQueries({
            queryKey: [
              "vendors",
            ],
          });

        notify.success(
          "Vendor created successfully.",
        );
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create vendor.",
          ),
        );
      },
    });


  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  const updateMutation =
    useMutation({
      mutationFn: ({
        vendorUuid,
        payload,
      }: {
        vendorUuid:
          string;

        payload:
          UpdateVendorDto;
      }) =>
        updateVendor(
          vendorUuid,
          payload,
        ),

      onSuccess: async (
        vendor,
      ) => {
        await Promise.all([
          queryClient
            .invalidateQueries({
              queryKey: [
                "vendors",
              ],
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "vendor",
                vendor.uuid,
              ],
            }),
        ]);

        notify.success(
          "Vendor updated successfully.",
        );
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update vendor.",
          ),
        );
      },
    });


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const deleteMutation =
    useMutation({
      mutationFn: (
        vendorUuid:
          string,
      ) =>
        deleteVendor(
          vendorUuid,
        ),

      onSuccess: async (
        result,
      ) => {
        queryClient
          .removeQueries({
            queryKey: [
              "vendor",
              result.uuid,
            ],
          });

        queryClient
          .removeQueries({
            queryKey: [
              "vendor-categories",
              result.uuid,
            ],
          });

        await queryClient
          .invalidateQueries({
            queryKey: [
              "vendors",
            ],
          });

        notify.success(
          "Vendor deleted successfully.",
        );
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete vendor.",
          ),
        );
      },
    });


  /*
   * =========================================================
   * UPDATE VENDOR CATEGORIES
   * =========================================================
   */

  const categoriesMutation =
    useMutation({
      mutationFn: ({
        vendorUuid,
        payload,
      }: {
        vendorUuid:
          string;

        payload:
          UpdateVendorCategoriesDto;
      }) =>
        updateVendorCategories(
          vendorUuid,
          payload,
        ),

      onSuccess: async (
        _result,
        variables,
      ) => {
        await Promise.all([
          queryClient
            .invalidateQueries({
              queryKey: [
                "vendors",
              ],
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "vendor",
                variables
                  .vendorUuid,
              ],
            }),

          queryClient
            .invalidateQueries({
              queryKey: [
                "vendor-categories",
                variables
                  .vendorUuid,
              ],
            }),
        ]);

        notify.success(
          "Vendor categories updated successfully.",
        );
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update vendor categories.",
          ),
        );
      },
    });


  /*
   * =========================================================
   * IMPERATIVE DETAIL FETCH
   * =========================================================
   *
   * Edit/View modal open karte waqt
   * latest vendor fetch kar sakte hain.
   */

  const fetchVendor =
    async (
      vendorUuid:
        string,
    ) => {
      return queryClient
        .fetchQuery({
          queryKey: [
            "vendor",
            vendorUuid,
          ],

          queryFn: () =>
            getVendor(
              vendorUuid,
            ),

          staleTime:
            60 * 1000,
        });
    };


  /*
   * =========================================================
   * IMPERATIVE CATEGORY FETCH
   * =========================================================
   */

  const fetchVendorCategories =
    async (
      vendorUuid:
        string,
    ) => {
      return queryClient
        .fetchQuery({
          queryKey: [
            "vendor-categories",
            vendorUuid,
          ],

          queryFn: () =>
            getVendorCategories(
              vendorUuid,
            ),

          staleTime:
            60 * 1000,
        });
    };


  return {
    /*
     * List
     */
    vendors:
      vendorsQuery
        .data
        ?.vendors ??
      [],

    pagination:
      vendorsQuery
        .data
        ?.pagination,

    total:
      vendorsQuery
        .data
        ?.pagination
        .total ??
      0,

    page:
      vendorsQuery
        .data
        ?.pagination
        .page ??
      query.page ??
      1,

    totalPages:
      vendorsQuery
        .data
        ?.pagination
        .totalPages ??
      0,


    /*
     * Loading
     */
    loading:
      vendorsQuery
        .isLoading,

    fetching:
      vendorsQuery
        .isFetching,


    /*
     * Manual fetch
     */
    fetchVendor,

    fetchVendorCategories,

    refetch:
      vendorsQuery
        .refetch,


    /*
     * Mutations
     */
    createVendor:
      createMutation
        .mutateAsync,

    updateVendor:
      updateMutation
        .mutateAsync,

    deleteVendor:
      deleteMutation
        .mutateAsync,

    saveVendorCategories:
      categoriesMutation
        .mutateAsync,


    /*
     * Mutation states
     */
    creating:
      createMutation
        .isPending,

    updating:
      updateMutation
        .isPending,

    deleting:
      deleteMutation
        .isPending,

    savingCategories:
      categoriesMutation
        .isPending,
  };
};