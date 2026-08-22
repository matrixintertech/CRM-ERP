import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createVendorCategory,
  deleteVendorCategory,
  getVendorCategories,
  getVendorCategory,
  updateVendorCategory,
  updateVendorCategoryStatus,
} from "../api/vendor-category.api";

import type {
  CreateVendorCategoryDto,
  UpdateVendorCategoryDto,
  VendorCategoryQueryParams,
} from "../api/vendor-category.api";


const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;

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


export const useVendorCategories =
  (
    query:
      VendorCategoryQueryParams = {},
  ) => {
    const queryClient =
      useQueryClient();


    /*
     * =========================================================
     * CATEGORY LIST
     * =========================================================
     */

    const categoriesQuery =
      useQuery({
        queryKey: [
          "vendor-categories",
          query,
        ],

        queryFn: () =>
          getVendorCategories(
            query,
          ),

        staleTime:
          5 * 60 * 1000,
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
            CreateVendorCategoryDto,
        ) =>
          createVendorCategory(
            payload,
          ),

        onSuccess:
          async () => {
            await queryClient
              .invalidateQueries({
                queryKey: [
                  "vendor-categories",
                ],
              });


            notify.success(
              "Vendor category created successfully.",
            );
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create vendor category.",
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
          categoryUuid,
          payload,
        }: {
          categoryUuid:
            string;

          payload:
            UpdateVendorCategoryDto;
        }) =>
          updateVendorCategory(
            categoryUuid,
            payload,
          ),

        onSuccess:
          async (
            category,
          ) => {
            await Promise.all([
              queryClient
                .invalidateQueries({
                  queryKey: [
                    "vendor-categories",
                  ],
                }),

              queryClient
                .invalidateQueries({
                  queryKey: [
                    "vendor-category",
                    category.uuid,
                  ],
                }),
            ]);


            notify.success(
              "Vendor category updated successfully.",
            );
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update vendor category.",
            ),
          );
        },
      });


    /*
     * =========================================================
     * STATUS
     * =========================================================
     */

    const statusMutation =
      useMutation({
        mutationFn: ({
          categoryUuid,
          status,
        }: {
          categoryUuid:
            string;

          status:
            | "ACTIVE"
            | "INACTIVE";
        }) =>
          updateVendorCategoryStatus(
            categoryUuid,
            status,
          ),

        onSuccess:
          async (
            category,
          ) => {
            await Promise.all([
              queryClient
                .invalidateQueries({
                  queryKey: [
                    "vendor-categories",
                  ],
                }),

              queryClient
                .invalidateQueries({
                  queryKey: [
                    "vendor-category",
                    category.uuid,
                  ],
                }),
            ]);


            notify.success(
              "Vendor category status updated successfully.",
            );
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update vendor category status.",
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
          categoryUuid:
            string,
        ) =>
          deleteVendorCategory(
            categoryUuid,
          ),

        onSuccess:
          async (
            result,
          ) => {
            queryClient
              .removeQueries({
                queryKey: [
                  "vendor-category",
                  result.uuid,
                ],
              });


            await queryClient
              .invalidateQueries({
                queryKey: [
                  "vendor-categories",
                ],
              });


            /*
             * Vendor detail/list me category
             * assignments visible ho sakte hain.
             */
            await queryClient
              .invalidateQueries({
                queryKey: [
                  "vendors",
                ],
              });


            notify.success(
              "Vendor category deleted successfully.",
            );
          },

        onError: (
          error,
        ) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete vendor category.",
            ),
          );
        },
      });


    /*
     * =========================================================
     * FETCH SINGLE CATEGORY
     * =========================================================
     */

    const fetchCategory =
      async (
        categoryUuid:
          string,
      ) => {
        return queryClient
          .fetchQuery({
            queryKey: [
              "vendor-category",
              categoryUuid,
            ],

            queryFn: () =>
              getVendorCategory(
                categoryUuid,
              ),

            staleTime:
              5 *
              60 *
              1000,
          });
      };


    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

    return {
      /*
       * List
       */
      categories:
        categoriesQuery
          .data
          ?.categories ??
        [],

      pagination:
        categoriesQuery
          .data
          ?.pagination,

      total:
        categoriesQuery
          .data
          ?.pagination
          .total ??
        0,

      page:
        categoriesQuery
          .data
          ?.pagination
          .page ??
        query.page ??
        1,

      totalPages:
        categoriesQuery
          .data
          ?.pagination
          .totalPages ??
        0,


      /*
       * Query state
       */
      loading:
        categoriesQuery
          .isLoading,

      fetching:
        categoriesQuery
          .isFetching,

      refetch:
        categoriesQuery
          .refetch,


      /*
       * Single fetch
       */
      fetchCategory,


      /*
       * Mutations
       */
      createCategory:
        createMutation
          .mutateAsync,

      updateCategory:
        updateMutation
          .mutateAsync,

      updateCategoryStatus:
        statusMutation
          .mutateAsync,

      deleteCategory:
        deleteMutation
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

      updatingStatus:
        statusMutation
          .isPending,

      deleting:
        deleteMutation
          .isPending,
    };
  };