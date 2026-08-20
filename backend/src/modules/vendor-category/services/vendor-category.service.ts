import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Status,
} from "@prisma/client";

import {
  CreateVendorCategoryDto,
  UpdateVendorCategoryDto,
  VendorCategoryQueryDto,
} from "../dto";

import {
  VendorCategoryRepository,
} from "../repositories/vendor-category.repository";


@Injectable()
export class VendorCategoryService {
  constructor(
    private readonly vendorCategoryRepository:
      VendorCategoryRepository,
  ) {}


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(
    dto:
      CreateVendorCategoryDto,
  ) {
    const name =
      dto.name.trim();

    const code =
      this.normalizeCode(
        dto.code,
      );


    const existing =
      await this.vendorCategoryRepository
        .findByCode(
          code,
        );


    if (
      existing
    ) {
      throw new ConflictException(
        "Vendor category code already exists.",
      );
    }


    const category =
      await this.vendorCategoryRepository
        .create({
          name,

          code,

          description:
            this.normalizeOptionalString(
              dto.description,
            ),

          sortOrder:
            dto.sortOrder ??
            0,
        });


    return {
      message:
        "Vendor category created successfully.",

      category,
    };
  }


  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  async findAll(
    query:
      VendorCategoryQueryDto,
  ) {
    const result =
      await this.vendorCategoryRepository
        .findMany({
          search:
            query.search
              ?.trim() ||
            undefined,

          page:
            query.page ??
            1,

          limit:
            query.limit ??
            20,
        });


    return {
      message:
        "Vendor categories fetched successfully.",

      ...result,
    };
  }


  /*
   * =========================================================
   * DETAIL
   * =========================================================
   */

  async findOne(
    categoryUuid:
      string,
  ) {
    const category =
      await this.vendorCategoryRepository
        .findByUuid(
          categoryUuid,
        );


    if (
      !category
    ) {
      throw new NotFoundException(
        "Vendor category not found.",
      );
    }


    return {
      message:
        "Vendor category fetched successfully.",

      category,
    };
  }


  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  async update(
    categoryUuid:
      string,

    dto:
      UpdateVendorCategoryDto,
  ) {
    const category =
      await this.vendorCategoryRepository
        .findByUuid(
          categoryUuid,
        );


    if (
      !category
    ) {
      throw new NotFoundException(
        "Vendor category not found.",
      );
    }


    let code:
      string | undefined;


    if (
      dto.code !==
      undefined
    ) {
      code =
        this.normalizeCode(
          dto.code,
        );


      const existing =
        await this.vendorCategoryRepository
          .findByCode(
            code,
          );


      if (
        existing &&
        existing.id !==
          category.id
      ) {
        throw new ConflictException(
          "Vendor category code already exists.",
        );
      }
    }


    const updated =
      await this.vendorCategoryRepository
        .update(
          category.id,
          {
            ...(dto.name !==
            undefined
              ? {
                  name:
                    dto.name
                      .trim(),
                }
              : {}),

            ...(dto.code !==
            undefined
              ? {
                  code,
                }
              : {}),

            ...(dto.description !==
            undefined
              ? {
                  description:
                    this
                      .normalizeOptionalString(
                        dto.description,
                      ),
                }
              : {}),

            ...(dto.sortOrder !==
            undefined
              ? {
                  sortOrder:
                    dto.sortOrder,
                }
              : {}),
          },
        );


    return {
      message:
        "Vendor category updated successfully.",

      category:
        updated,
    };
  }


  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  async updateStatus(
    categoryUuid:
      string,

    status:
      Status,
  ) {
    const category =
      await this.vendorCategoryRepository
        .findByUuid(
          categoryUuid,
        );


    if (
      !category
    ) {
      throw new NotFoundException(
        "Vendor category not found.",
      );
    }


    const updated =
      await this.vendorCategoryRepository
        .update(
          category.id,
          {
            status,
          },
        );


    return {
      message:
        "Vendor category status updated successfully.",

      category:
        updated,
    };
  }


  /*
   * =========================================================
   * SOFT DELETE
   * =========================================================
   */

  async remove(
    categoryUuid:
      string,
  ) {
    const category =
      await this.vendorCategoryRepository
        .findByUuid(
          categoryUuid,
        );


    if (
      !category
    ) {
      throw new NotFoundException(
        "Vendor category not found.",
      );
    }


    const assignedVendors =
      await this.vendorCategoryRepository
        .countAssignedVendors(
          category.id,
        );


    if (
      assignedVendors >
      0
    ) {
      throw new BadRequestException(
        "Vendor category cannot be deleted because it is assigned to vendors.",
      );
    }


    await this.vendorCategoryRepository
      .softDelete(
        category.id,
      );


    return {
      message:
        "Vendor category deleted successfully.",

      uuid:
        category.uuid,
    };
  }


  /*
   * =========================================================
   * NORMALIZATION
   * =========================================================
   */

  private normalizeCode(
    value:
      string,
  ) {
    return value
      .trim()
      .toUpperCase()
      .replace(
        /\s+/g,
        "_",
      );
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
}