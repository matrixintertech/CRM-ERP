export type VendorStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "REJECTED";


export type VendorMarketplaceStatus =
  | "PRIVATE"
  | "PENDING"
  | "PUBLISHED"
  | "SUSPENDED";


export type VendorOnboardingSource =
  | "SELF_REGISTRATION"
  | "COMPANY_INVITE"
  | "PLATFORM_CREATED";


/*
 * =========================================================
 * CATEGORY
 * =========================================================
 */

export interface VendorCategorySummary {
  id: string;
  uuid: string;

  name: string;
  code: string;

  description?:
    string | null;

  sortOrder: number;

  status:
    "ACTIVE" | "INACTIVE";
}


export interface VendorCategoryAssignment {
  id: string;

  vendorId:
    string;

  categoryId:
    string;

  isPrimary:
    boolean;

  category:
    VendorCategorySummary;
}


/*
 * =========================================================
 * SERVICE AREA
 * =========================================================
 *
 * Detail API me serviceAreas aa sakte hain.
 * Management UI baad me banayenge.
 */

export type VendorServiceAreaType =
  | "NATIONAL"
  | "STATE"
  | "CITY"
  | "PINCODE"
  | "RADIUS";


export interface VendorLocationSummary {
  id: string;
  uuid: string;
  name: string;

  code?: string | null;
}


export interface VendorServiceArea {
  id: string;
  uuid: string;

  type:
    VendorServiceAreaType;

  stateId?:
    string | null;

  state?:
    VendorLocationSummary | null;

  cityId?:
    string | null;

  city?:
    VendorLocationSummary | null;

  pincode?:
    string | null;

  latitude?:
    string | null;

  longitude?:
    string | null;

  radiusKm?:
    string | null;

  isActive:
    boolean;
}


/*
 * =========================================================
 * VENDOR
 * =========================================================
 */

export interface Vendor {
  id: string;
  uuid: string;

  legalName: string;

  displayName?:
    string | null;

  panNumber?:
    string | null;

  primaryGstNumber?:
    string | null;

  email?:
    string | null;

  mobile?:
    string | null;

  website?:
    string | null;

  address?:
    string | null;

  pincode?:
    string | null;

  onboardingSource:
    VendorOnboardingSource;

  status:
    VendorStatus;

  marketplaceStatus:
    VendorMarketplaceStatus;

  isVerified:
    boolean;

  verifiedAt?:
    string | null;

  remarks?:
    string | null;

  categories?:
    VendorCategoryAssignment[];

  serviceAreas?:
    VendorServiceArea[];

  _count?: {
    companySuppliers?:
      number;

    subscriptions?:
      number;
  };

  createdAt:
    string;

  updatedAt:
    string;

  deletedAt?:
    string | null;
}


/*
 * =========================================================
 * CREATE
 * =========================================================
 */

export interface CreateVendorDto {
  legalName: string;

  displayName?:
    string;

  panNumber?:
    string;

  primaryGstNumber?:
    string;

  email?:
    string;

  mobile?:
    string;

  website?:
    string;

  address?:
    string;

  pincode?:
    string;

  remarks?:
    string;
}


/*
 * =========================================================
 * UPDATE
 * =========================================================
 */

export type UpdateVendorDto =
  Partial<CreateVendorDto>;


/*
 * =========================================================
 * QUERY
 * =========================================================
 */

export interface VendorQueryParams {
  search?:
    string;

  status?:
    VendorStatus;

  marketplaceStatus?:
    VendorMarketplaceStatus;

  page?:
    number;

  limit?:
    number;
}


/*
 * =========================================================
 * PAGINATION
 * =========================================================
 */

export interface VendorPagination {
  page:
    number;

  limit:
    number;

  total:
    number;

  totalPages:
    number;
}


/*
 * =========================================================
 * LIST RESPONSE
 * =========================================================
 */

export interface VendorListResponse {
  vendors:
    Vendor[];

  pagination:
    VendorPagination;
}


/*
 * =========================================================
 * CATEGORY ASSIGNMENT
 * =========================================================
 */

export interface UpdateVendorCategoriesDto {
  categories: {
    categoryUuid:
      string;
  }[];

  primaryCategoryUuid:
    string;
}


export interface VendorCategoriesResponse {
  message:
    string;

  categories:
    VendorCategoryAssignment[];
}