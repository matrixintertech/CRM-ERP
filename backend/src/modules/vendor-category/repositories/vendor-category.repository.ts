import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";


interface CreateVendorCategoryInput {
  name: string;

  code: string;

  description?:
    string | null;

  sortOrder?:
    number;
}


interface UpdateVendorCategoryInput {
  name?: string;

  code?: string;

  description?:
    string | null;

  sortOrder?:
    number;

  status?:
    Status;
}


interface VendorCategoryListInput {
  search?: string;

  page: number;

  limit: number;
}


@Injectable()
export class VendorCategoryRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  async create(
    input:
      CreateVendorCategoryInput,
  ) {
    return this.prisma
      .vendorCategory
      .create({
        data: {
          name:
            input.name,

          code:
            input.code,

          description:
            input.description ??
            null,

          sortOrder:
            input.sortOrder ??
            0,
        },
      });
  }


  /*
   * =========================================================
   * FIND BY UUID
   * =========================================================
   */

  async findByUuid(
    categoryUuid:
      string,
  ) {
    return this.prisma
      .vendorCategory
      .findFirst({
        where: {
          uuid:
            categoryUuid,

          deletedAt:
            null,
        },

        include: {
          _count: {
            select: {
              vendors:
                true,
            },
          },
        },
      });
  }


  /*
   * =========================================================
   * FIND BY ID
   * =========================================================
   */

  async findById(
    categoryId:
      bigint,
  ) {
    return this.prisma
      .vendorCategory
      .findFirst({
        where: {
          id:
            categoryId,

          deletedAt:
            null,
        },
      });
  }


  /*
   * =========================================================
   * FIND BY CODE
   * =========================================================
   */

  async findByCode(
    code:
      string,
  ) {
    return this.prisma
      .vendorCategory
      .findFirst({
        where: {
          code: {
            equals:
              code.trim(),

            mode:
              "insensitive",
          },

          deletedAt:
            null,
        },
      });
  }


  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  async findMany(
    input:
      VendorCategoryListInput,
  ) {
    const page =
      Math.max(
        1,
        input.page,
      );

    const limit =
      Math.min(
        100,
        Math.max(
          1,
          input.limit,
        ),
      );

    const skip =
      (page - 1) *
      limit;

    const search =
      input.search
        ?.trim() ||
      undefined;


    const where:
      Prisma.VendorCategoryWhereInput =
      {
        deletedAt:
          null,

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  code: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  description: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },
              ],
            }
          : {}),
      };


    const [
      categories,
      total,
    ] =
      await this.prisma
        .$transaction([
          this.prisma
            .vendorCategory
            .findMany({
              where,

              orderBy: [
                {
                  sortOrder:
                    "asc",
                },

                {
                  name:
                    "asc",
                },
              ],

              skip,

              take:
                limit,

              include: {
                _count: {
                  select: {
                    vendors:
                      true,
                  },
                },
              },
            }),

          this.prisma
            .vendorCategory
            .count({
              where,
            }),
        ]);


    return {
      categories,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total /
              limit,
          ),
      },
    };
  }


  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  async update(
    categoryId:
      bigint,

    input:
      UpdateVendorCategoryInput,
  ) {
    return this.prisma
      .vendorCategory
      .update({
        where: {
          id:
            categoryId,
        },

        data: {
          ...input,
        },
      });
  }


  /*
   * =========================================================
   * SOFT DELETE
   * =========================================================
   */

  async softDelete(
    categoryId:
      bigint,
  ) {
    return this.prisma
      .vendorCategory
      .update({
        where: {
          id:
            categoryId,
        },

        data: {
          deletedAt:
            new Date(),

          status:
            Status.INACTIVE,
        },
      });
  }


  /*
   * =========================================================
   * COUNT ASSIGNED VENDORS
   * =========================================================
   */

  async countAssignedVendors(
    categoryId:
      bigint,
  ) {
    return this.prisma
      .vendorCategoryAssignment
      .count({
        where: {
          categoryId,
        },
      });
  }
}