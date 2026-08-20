import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  VendorMarketplaceStatus,
  VendorOnboardingSource,
  VendorStatus,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";


interface CreateVendorInput {
  legalName: string;

  displayName?: string | null;

  panNumber?: string | null;

  primaryGstNumber?: string | null;

  email?: string | null;

  mobile?: string | null;

  website?: string | null;

  address?: string | null;

  pincode?: string | null;

  onboardingSource:
    VendorOnboardingSource;

  remarks?: string | null;
}


interface UpdateVendorInput {
  legalName?: string;

  displayName?: string | null;

  panNumber?: string | null;

  primaryGstNumber?: string | null;

  email?: string | null;

  mobile?: string | null;

  website?: string | null;

  address?: string | null;

  pincode?: string | null;

  remarks?: string | null;

  status?: VendorStatus;

  marketplaceStatus?:
    VendorMarketplaceStatus;
}


interface VendorListInput {
  search?: string;

  status?: VendorStatus;

  marketplaceStatus?:
    VendorMarketplaceStatus;

  page: number;

  limit: number;
}


interface VendorDuplicateInput {
  panNumber?: string | null;

  primaryGstNumber?: string | null;

  email?: string | null;

  mobile?: string | null;

  excludeVendorId?: bigint;
}


@Injectable()
export class VendorRepository {
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
      CreateVendorInput,
  ) {
    return this.prisma
      .vendorProfile
      .create({
        data: {
          legalName:
            input.legalName,

          displayName:
            input.displayName ??
            null,

          panNumber:
            input.panNumber ??
            null,

          primaryGstNumber:
            input.primaryGstNumber ??
            null,

          email:
            input.email ??
            null,

          mobile:
            input.mobile ??
            null,

          website:
            input.website ??
            null,

          address:
            input.address ??
            null,

          pincode:
            input.pincode ??
            null,

          onboardingSource:
            input.onboardingSource,

          remarks:
            input.remarks ??
            null,
        },
      });
  }


  /*
   * =========================================================
   * FIND BY UUID
   * =========================================================
   */

  async findByUuid(
    vendorUuid:
      string,
  ) {
    return this.prisma
      .vendorProfile
      .findFirst({
        where: {
          uuid:
            vendorUuid,

          deletedAt:
            null,
        },

        include: {
          categories: {
            include: {
              category:
                true,
            },
          },

          serviceAreas: {
            include: {
              state:
                true,

              city:
                true,
            },
          },

          contacts: {
            where: {
              deletedAt:
                null,
            },
          },

          addresses: {
            where: {
              deletedAt:
                null,
            },

            include: {
              state:
                true,

              city:
                true,
            },
          },

          taxRegistrations: {
            where: {
              deletedAt:
                null,
            },

            include: {
              state:
                true,
            },
          },

          bankAccounts: {
            where: {
              deletedAt:
                null,
            },
          },
        },
      });
  }


  /*
   * =========================================================
   * FIND BY INTERNAL ID
   * =========================================================
   */

  async findById(
    vendorId:
      bigint,
  ) {
    return this.prisma
      .vendorProfile
      .findFirst({
        where: {
          id:
            vendorId,

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
      VendorListInput,
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
      Prisma.VendorProfileWhereInput =
      {
        deletedAt:
          null,

        ...(input.status
          ? {
              status:
                input.status,
            }
          : {}),

        ...(input
          .marketplaceStatus
          ? {
              marketplaceStatus:
                input
                  .marketplaceStatus,
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  legalName: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  displayName: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  panNumber: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  primaryGstNumber:
                    {
                      contains:
                        search,

                      mode:
                        "insensitive",
                    },
                },

                {
                  email: {
                    contains:
                      search,

                    mode:
                      "insensitive",
                  },
                },

                {
                  mobile: {
                    contains:
                      search,
                  },
                },
              ],
            }
          : {}),
      };


    const [
      vendors,
      total,
    ] =
      await this.prisma
        .$transaction([
          this.prisma
            .vendorProfile
            .findMany({
              where,

              orderBy: [
                {
                  isVerified:
                    "desc",
                },

                {
                  createdAt:
                    "desc",
                },
              ],

              skip,

              take:
                limit,

              include: {
                categories: {
                  include: {
                    category:
                      true,
                  },
                },

                serviceAreas: {
                  where: {
                    isActive:
                      true,
                  },

                  include: {
                    state:
                      true,

                    city:
                      true,
                  },
                },

                _count: {
                  select: {
                    companySuppliers:
                      true,

                    subscriptions:
                      true,
                  },
                },
              },
            }),

          this.prisma
            .vendorProfile
            .count({
              where,
            }),
        ]);


    return {
      vendors,

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
    vendorId:
      bigint,

    input:
      UpdateVendorInput,
  ) {
    return this.prisma
      .vendorProfile
      .update({
        where: {
          id:
            vendorId,
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
    vendorId:
      bigint,
  ) {
    return this.prisma
      .vendorProfile
      .update({
        where: {
          id:
            vendorId,
        },

        data: {
          deletedAt:
            new Date(),

          marketplaceStatus:
            VendorMarketplaceStatus.PRIVATE,
        },
      });
  }


  /*
   * =========================================================
   * DUPLICATE / IDENTITY LOOKUP
   * =========================================================
   *
   * Important:
   *
   * Email/mobile alone vendor business ki
   * guaranteed identity nahi hain.
   *
   * Service layer decide karegi ki result
   * actual duplicate hai ya warning.
   */

  async findPotentialDuplicate(
    input:
      VendorDuplicateInput,
  ) {
    const conditions:
      Prisma.VendorProfileWhereInput[] =
      [];


    if (
      input.panNumber
        ?.trim()
    ) {
      conditions.push({
        panNumber: {
          equals:
            input.panNumber
              .trim(),

          mode:
            "insensitive",
        },
      });
    }


    if (
      input
        .primaryGstNumber
        ?.trim()
    ) {
      conditions.push({
        primaryGstNumber:
          {
            equals:
              input
                .primaryGstNumber
                .trim(),

            mode:
              "insensitive",
          },
      });
    }


    if (
      input.email
        ?.trim()
    ) {
      conditions.push({
        email: {
          equals:
            input.email
              .trim(),

          mode:
            "insensitive",
        },
      });
    }


    if (
      input.mobile
        ?.trim()
    ) {
      conditions.push({
        mobile:
          input.mobile
            .trim(),
      });
    }


    if (
      conditions.length ===
      0
    ) {
      return null;
    }


    return this.prisma
      .vendorProfile
      .findFirst({
        where: {
          deletedAt:
            null,

          ...(input
            .excludeVendorId
            ? {
                id: {
                  not:
                    input
                      .excludeVendorId,
                },
              }
            : {}),

          OR:
            conditions,
        },
      });
  }


  /*
   * =========================================================
   * GST LOOKUP
   * =========================================================
   */

  async findByGstNumber(
    gstNumber:
      string,
  ) {
    return this.prisma
      .vendorProfile
      .findFirst({
        where: {
          primaryGstNumber:
            {
              equals:
                gstNumber.trim(),

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
   * PAN LOOKUP
   * =========================================================
   */

  async findByPanNumber(
    panNumber:
      string,
  ) {
    return this.prisma
      .vendorProfile
      .findFirst({
        where: {
          panNumber: {
            equals:
              panNumber.trim(),

            mode:
              "insensitive",
          },

          deletedAt:
            null,
        },
      });
  }
}