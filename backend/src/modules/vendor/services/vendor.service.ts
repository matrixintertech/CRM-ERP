import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  VendorOnboardingSource,
} from "@prisma/client";

import {
  CreateVendorDto,
  UpdateVendorCategoriesDto,
  UpdateVendorDto,
  VendorQueryDto,
} from "../dto";

import {
  VendorRepository,
} from "../repositories/vendor.repository";


@Injectable()
export class VendorService {
  constructor(
    private readonly vendorRepository:
      VendorRepository,
  ) {}


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(
    dto:
      CreateVendorDto,

    onboardingSource:
      VendorOnboardingSource =
        VendorOnboardingSource.PLATFORM_CREATED,
  ) {
    const legalName =
      dto.legalName.trim();

    const panNumber =
      this.normalizePan(
        dto.panNumber,
      );

    const primaryGstNumber =
      this.normalizeGst(
        dto.primaryGstNumber,
      );

    const email =
      this.normalizeEmail(
        dto.email,
      );

    const mobile =
      this.normalizeOptionalString(
        dto.mobile,
      );


    await this
      .ensureBusinessIdentityAvailable(
        {
          panNumber,
          primaryGstNumber,
        },
      );


    return this.vendorRepository
      .create({
        legalName,

        displayName:
          this.normalizeOptionalString(
            dto.displayName,
          ),

        panNumber,

        primaryGstNumber,

        email,

        mobile,

        website:
          this.normalizeOptionalString(
            dto.website,
          ),

        address:
          this.normalizeOptionalString(
            dto.address,
          ),

        pincode:
          this.normalizeOptionalString(
            dto.pincode,
          ),

        /*
         * Source frontend se trust nahi karenge.
         *
         * SELF_REGISTRATION / COMPANY_INVITE
         * respective workflow service pass karegi.
         */
        onboardingSource,

        remarks:
          this.normalizeOptionalString(
            dto.remarks,
          ),
      });
  }


  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  async findAll(
    query:
      VendorQueryDto,
  ) {
    return this.vendorRepository
      .findMany({
        search:
          query.search
            ?.trim() ||
          undefined,

        status:
          query.status,

        marketplaceStatus:
          query.marketplaceStatus,

        page:
          query.page ??
          1,

        limit:
          query.limit ??
          20,
      });
  }


  /*
   * =========================================================
   * DETAIL
   * =========================================================
   */

  async findOne(
    vendorUuid:
      string,
  ) {
    const vendor =
      await this.vendorRepository
        .findByUuid(
          vendorUuid,
        );


    if (
      !vendor
    ) {
      throw new NotFoundException(
        "Vendor not found.",
      );
    }


    return vendor;
  }


  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  async update(
    vendorUuid:
      string,

    dto:
      UpdateVendorDto,
  ) {
    const existingVendor =
      await this.vendorRepository
        .findByUuid(
          vendorUuid,
        );


    if (
      !existingVendor
    ) {
      throw new NotFoundException(
        "Vendor not found.",
      );
    }


    const panNumber =
      dto.panNumber !==
      undefined
        ? this.normalizePan(
            dto.panNumber,
          )
        : undefined;


    const primaryGstNumber =
      dto.primaryGstNumber !==
      undefined
        ? this.normalizeGst(
            dto.primaryGstNumber,
          )
        : undefined;


    await this
      .ensureBusinessIdentityAvailable(
        {
          panNumber,

          primaryGstNumber,

          excludeVendorId:
            existingVendor.id,
        },
      );


    return this.vendorRepository
      .update(
        existingVendor.id,
        {
          ...(dto.legalName !==
          undefined
            ? {
                legalName:
                  dto.legalName
                    .trim(),
              }
            : {}),

          ...(dto.displayName !==
          undefined
            ? {
                displayName:
                  this
                    .normalizeOptionalString(
                      dto.displayName,
                    ),
              }
            : {}),

          ...(dto.panNumber !==
          undefined
            ? {
                panNumber,
              }
            : {}),

          ...(dto.primaryGstNumber !==
          undefined
            ? {
                primaryGstNumber,
              }
            : {}),

          ...(dto.email !==
          undefined
            ? {
                email:
                  this.normalizeEmail(
                    dto.email,
                  ),
              }
            : {}),

          ...(dto.mobile !==
          undefined
            ? {
                mobile:
                  this
                    .normalizeOptionalString(
                      dto.mobile,
                    ),
              }
            : {}),

          ...(dto.website !==
          undefined
            ? {
                website:
                  this
                    .normalizeOptionalString(
                      dto.website,
                    ),
              }
            : {}),

          ...(dto.address !==
          undefined
            ? {
                address:
                  this
                    .normalizeOptionalString(
                      dto.address,
                    ),
              }
            : {}),

          ...(dto.pincode !==
          undefined
            ? {
                pincode:
                  this
                    .normalizeOptionalString(
                      dto.pincode,
                    ),
              }
            : {}),

          ...(dto.remarks !==
          undefined
            ? {
                remarks:
                  this
                    .normalizeOptionalString(
                      dto.remarks,
                    ),
              }
            : {}),

          /*
           * Agar UpdateVendorDto me status /
           * marketplaceStatus later add karte ho
           * to yahan controlled update karenge.
           */
        },
      );
  }


  /*
   * =========================================================
   * SOFT DELETE
   * =========================================================
   */

  async remove(
    vendorUuid:
      string,
  ) {
    const vendor =
      await this.vendorRepository
        .findByUuid(
          vendorUuid,
        );


    if (
      !vendor
    ) {
      throw new NotFoundException(
        "Vendor not found.",
      );
    }


    await this.vendorRepository
      .softDelete(
        vendor.id,
      );


    return {
      uuid:
        vendor.uuid,

      deleted:
        true,
    };
  }


  /*
   * =========================================================
   * BUSINESS IDENTITY CHECK
   * =========================================================
   */

  private async ensureBusinessIdentityAvailable(
    input: {
      panNumber?:
        string | null;

      primaryGstNumber?:
        string | null;

      excludeVendorId?:
        bigint;
    },
  ) {
    if (
      input.primaryGstNumber
    ) {
      const vendorByGst =
        await this.vendorRepository
          .findByGstNumber(
            input.primaryGstNumber,
          );


      if (
        vendorByGst &&
        vendorByGst.id !==
          input.excludeVendorId
      ) {
        throw new ConflictException(
          "A vendor with this GST number already exists.",
        );
      }
    }


    if (
      input.panNumber
    ) {
      const vendorByPan =
        await this.vendorRepository
          .findByPanNumber(
            input.panNumber,
          );


      if (
        vendorByPan &&
        vendorByPan.id !==
          input.excludeVendorId
      ) {
        throw new ConflictException(
          "A vendor with this PAN number already exists.",
        );
      }
    }
  }


  /*
   * =========================================================
   * NORMALIZATION
   * =========================================================
   */

  private normalizePan(
    value?:
      string | null,
  ) {
    const normalized =
      value
        ?.trim()
        .toUpperCase();

    return normalized ||
      null;
  }


  private normalizeGst(
    value?:
      string | null,
  ) {
    const normalized =
      value
        ?.trim()
        .toUpperCase();

    return normalized ||
      null;
  }


  private normalizeEmail(
    value?:
      string | null,
  ) {
    const normalized =
      value
        ?.trim()
        .toLowerCase();

    return normalized ||
      null;
  }


  private normalizeOptionalString(
    value?:
      string | null,
  ) {
    const normalized =
      value
        ?.trim();

    return normalized ||
      null;
  }

/*
 * =========================================================
 * GET VENDOR CATEGORIES
 * =========================================================
 */

async getCategories(
  vendorUuid: string,
) {
  const vendor =
    await this.vendorRepository
      .findByUuid(
        vendorUuid,
      );


  if (!vendor) {
    throw new NotFoundException(
      "Vendor not found.",
    );
  }


  const categories =
    await this.vendorRepository
      .findCategories(
        vendor.id,
      );


  return {
    message:
      "Vendor categories fetched successfully.",

    categories,
  };
}


/*
 * =========================================================
 * UPDATE / REPLACE VENDOR CATEGORIES
 * =========================================================
 */

async updateCategories(
  vendorUuid: string,
  dto: UpdateVendorCategoriesDto,
) {
  /*
   * Vendor validate.
   */
  const vendor =
    await this.vendorRepository
      .findByUuid(
        vendorUuid,
      );


  if (!vendor) {
    throw new NotFoundException(
      "Vendor not found.",
    );
  }


  /*
   * Category UUIDs normalize.
   */
  const categoryUuids =
    dto.categories.map(
      (item) =>
        item.categoryUuid,
    );


  /*
   * Same category request me
   * multiple times nahi honi chahiye.
   */
  const uniqueCategoryUuids =
    Array.from(
      new Set(
        categoryUuids,
      ),
    );


  if (
    uniqueCategoryUuids.length !==
    categoryUuids.length
  ) {
    throw new BadRequestException(
      "Duplicate vendor categories are not allowed.",
    );
  }


  /*
   * Primary category selected
   * categories ke andar honi chahiye.
   */
  if (
    !uniqueCategoryUuids.includes(
      dto.primaryCategoryUuid,
    )
  ) {
    throw new BadRequestException(
      "Primary category must be included in selected categories.",
    );
  }


  /*
   * Only ACTIVE + non-deleted
   * categories repository return karega.
   */
  const categories =
    await this.vendorRepository
      .findActiveCategoriesByUuids(
        uniqueCategoryUuids,
      );


  /*
   * Agar requested UUID count aur
   * DB result count different hai,
   * koi category invalid/inactive/deleted hai.
   */
  if (
    categories.length !==
    uniqueCategoryUuids.length
  ) {
    throw new BadRequestException(
      "One or more vendor categories are invalid or inactive.",
    );
  }


  /*
   * Primary category DB result me
   * definitely available honi chahiye.
   */
  const primaryCategory =
    categories.find(
      (category) =>
        category.uuid ===
        dto.primaryCategoryUuid,
    );


  if (!primaryCategory) {
    throw new BadRequestException(
      "Primary vendor category is invalid.",
    );
  }


  /*
   * Internal IDs ke saath assignment
   * payload prepare karo.
   *
   * Exactly one category primary hogi.
   */
  const assignments =
    categories.map(
      (category) => ({
        categoryId:
          category.id,

        isPrimary:
          category.id ===
          primaryCategory.id,
      }),
    );


  const updatedCategories =
    await this.vendorRepository
      .replaceCategories(
        vendor.id,
        assignments,
      );


  return {
    message:
      "Vendor categories updated successfully.",

    categories:
      updatedCategories,
  };
}



}