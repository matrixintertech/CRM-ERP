import api from "@/shared/services/axios";

import type {
  CreateVendorDto,
  UpdateVendorCategoriesDto,
  UpdateVendorDto,
  Vendor,
  VendorCategoriesResponse,
  VendorListResponse,
  VendorQueryParams,
} from "../types/vendor.types";


interface ApiResponse<T> {
  data: T;
}


interface DeleteVendorResponse {
  uuid: string;
  deleted: boolean;
}


/*
 * =========================================================
 * GET VENDORS
 * =========================================================
 */

export const getVendors =
  async (
    params:
      VendorQueryParams = {},
  ): Promise<
    VendorListResponse
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          VendorListResponse
        >
      >(
        "/platform/vendors",
        {
          params,
        },
      );

    return data.data;
  };


/*
 * =========================================================
 * GET VENDOR DETAIL
 * =========================================================
 */

export const getVendor =
  async (
    vendorUuid:
      string,
  ): Promise<
    Vendor
  > => {
    const { data } =
      await api.get<
        ApiResponse<Vendor>
      >(
        `/platform/vendors/${vendorUuid}`,
      );

    return data.data;
  };


/*
 * =========================================================
 * CREATE VENDOR
 * =========================================================
 */

export const createVendor =
  async (
    payload:
      CreateVendorDto,
  ): Promise<
    Vendor
  > => {
    const { data } =
      await api.post<
        ApiResponse<Vendor>
      >(
        "/platform/vendors",
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * UPDATE VENDOR
 * =========================================================
 */

export const updateVendor =
  async (
    vendorUuid:
      string,

    payload:
      UpdateVendorDto,
  ): Promise<
    Vendor
  > => {
    const { data } =
      await api.patch<
        ApiResponse<Vendor>
      >(
        `/platform/vendors/${vendorUuid}`,
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * DELETE VENDOR
 * =========================================================
 */

export const deleteVendor =
  async (
    vendorUuid:
      string,
  ): Promise<
    DeleteVendorResponse
  > => {
    const { data } =
      await api.delete<
        ApiResponse<
          DeleteVendorResponse
        >
      >(
        `/platform/vendors/${vendorUuid}`,
      );

    return data.data;
  };


/*
 * =========================================================
 * GET VENDOR CATEGORIES
 * =========================================================
 */

export const getVendorCategories =
  async (
    vendorUuid:
      string,
  ): Promise<
    VendorCategoriesResponse
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          VendorCategoriesResponse
        >
      >(
        `/platform/vendors/${vendorUuid}/categories`,
      );

    return data.data;
  };


/*
 * =========================================================
 * UPDATE / REPLACE VENDOR CATEGORIES
 * =========================================================
 */

export const updateVendorCategories =
  async (
    vendorUuid:
      string,

    payload:
      UpdateVendorCategoriesDto,
  ): Promise<
    VendorCategoriesResponse
  > => {
    const { data } =
      await api.put<
        ApiResponse<
          VendorCategoriesResponse
        >
      >(
        `/platform/vendors/${vendorUuid}/categories`,
        payload,
      );

    return data.data;
  };