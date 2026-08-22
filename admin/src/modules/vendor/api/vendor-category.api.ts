import api from "@/shared/services/axios";

import type {
  VendorCategorySummary,
} from "../types/vendor.types";


export interface VendorCategoryQueryParams {
  search?: string;

  page?: number;

  limit?: number;
}


export interface CreateVendorCategoryDto {
  name: string;

  code: string;

  description?: string;

  sortOrder?: number;
}


export type UpdateVendorCategoryDto =
  Partial<CreateVendorCategoryDto>;


export interface VendorCategoryPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


export interface VendorCategoryListResponse {
  categories:
    VendorCategorySummary[];

  pagination:
    VendorCategoryPagination;
}


interface ApiResponse<T> {
  data: T;
}


interface DeleteVendorCategoryResponse {
  uuid: string;

  deleted: boolean;
}


/*
 * =========================================================
 * GET CATEGORIES
 * =========================================================
 */

export const getVendorCategories =
  async (
    params:
      VendorCategoryQueryParams = {},
  ): Promise<
    VendorCategoryListResponse
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          VendorCategoryListResponse
        >
      >(
        "/platform/vendor-categories",
        {
          params,
        },
      );

    return data.data;
  };


/*
 * =========================================================
 * GET CATEGORY
 * =========================================================
 */

export const getVendorCategory =
  async (
    categoryUuid:
      string,
  ): Promise<
    VendorCategorySummary
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          VendorCategorySummary
        >
      >(
        `/platform/vendor-categories/${categoryUuid}`,
      );

    return data.data;
  };


/*
 * =========================================================
 * CREATE CATEGORY
 * =========================================================
 */

export const createVendorCategory =
  async (
    payload:
      CreateVendorCategoryDto,
  ): Promise<
    VendorCategorySummary
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          VendorCategorySummary
        >
      >(
        "/platform/vendor-categories",
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * UPDATE CATEGORY
 * =========================================================
 */

export const updateVendorCategory =
  async (
    categoryUuid:
      string,

    payload:
      UpdateVendorCategoryDto,
  ): Promise<
    VendorCategorySummary
  > => {
    const { data } =
      await api.patch<
        ApiResponse<
          VendorCategorySummary
        >
      >(
        `/platform/vendor-categories/${categoryUuid}`,
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * UPDATE STATUS
 * =========================================================
 */

export const updateVendorCategoryStatus =
  async (
    categoryUuid:
      string,

    status:
      "ACTIVE" | "INACTIVE",
  ): Promise<
    VendorCategorySummary
  > => {
    const { data } =
      await api.patch<
        ApiResponse<
          VendorCategorySummary
        >
      >(
        `/platform/vendor-categories/${categoryUuid}/status`,
        {
          status,
        },
      );

    return data.data;
  };


/*
 * =========================================================
 * DELETE CATEGORY
 * =========================================================
 */

export const deleteVendorCategory =
  async (
    categoryUuid:
      string,
  ): Promise<
    DeleteVendorCategoryResponse
  > => {
    const { data } =
      await api.delete<
        ApiResponse<
          DeleteVendorCategoryResponse
        >
      >(
        `/platform/vendor-categories/${categoryUuid}`,
      );

    return data.data;
  };