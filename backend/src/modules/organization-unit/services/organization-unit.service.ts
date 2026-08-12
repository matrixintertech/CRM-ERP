import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
} from "@prisma/client";

import {
  CreateOrganizationUnitDto,
} from "../dto/create-organization-unit.dto";

import {
  UpdateOrganizationUnitDto,
} from "../dto/update-organization-unit.dto";

import {
  OrganizationUnitRepository,
} from "../repositories/organization-unit.repository";

import {
  StateRepository,
} from "../../master/state/repositories/state.repository";

import {
  CityRepository,
} from "../../master/city/repositories/city.repository";

import {
  CompanyBoundaryService,
} from "../../authorization/services/company-boundary.service";

interface AuthUser {
  id: bigint;
}

@Injectable()
export class OrganizationUnitService {
  constructor(
    private readonly organizationUnitRepository:
      OrganizationUnitRepository,

    private readonly stateRepository:
      StateRepository,

    private readonly cityRepository:
      CityRepository,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

  private async getCompanyId(
    user: AuthUser,
  ) {
    return this.companyBoundaryService.getCompanyId(
      user.id,
    );
  }

  async create(
    user: AuthUser,
    dto: CreateOrganizationUnitDto,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );

    const {
      parentUuid,
      stateUuid,
      cityUuid,
      code,
      name,
      ...unitData
    } = dto;

    let parentId:
      bigint | undefined;

    let stateId:
      bigint | undefined;

    let cityId:
      bigint | undefined;

    /*
     * Parent OU must belong to
     * the same company.
     */
    if (parentUuid) {
      const parent =
        await this.organizationUnitRepository.findByUuid(
          companyId,
          parentUuid,
        );

      if (!parent) {
        throw new NotFoundException(
          "Parent organization unit not found.",
        );
      }

      parentId =
        parent.id;
    }

    if (stateUuid) {
      const state =
        await this.stateRepository.findByUuid(
          stateUuid,
        );

      if (!state) {
        throw new NotFoundException(
          "State not found.",
        );
      }

      stateId =
        state.id;
    }

    if (cityUuid) {
      const city =
        await this.cityRepository.findByUuid(
          cityUuid,
        );

      if (!city) {
        throw new NotFoundException(
          "City not found.",
        );
      }

      if (
        stateId !== undefined &&
        city.stateId !== stateId
      ) {
        throw new BadRequestException(
          "Selected city does not belong to the selected state.",
        );
      }

      cityId =
        city.id;
    }

    const normalizedCode =
      code
        .trim()
        .toUpperCase();

    const normalizedName =
      name.trim();

    const existingCode =
      await this.organizationUnitRepository.findByCode(
        companyId,
        normalizedCode,
      );

    if (existingCode) {
      throw new ConflictException(
        "Organization unit code already exists.",
      );
    }

    const existingName =
      await this.organizationUnitRepository.findByName(
        companyId,
        normalizedName,
      );

    if (existingName) {
      throw new ConflictException(
        "Organization unit name already exists.",
      );
    }

    const createData:
      Prisma.OrganizationUnitCreateInput = {
      name:
        normalizedName,

      code:
        normalizedCode,

      type:
        unitData.type,

      email:
        unitData.email?.trim(),

      mobile:
        unitData.mobile?.trim(),

      addressLine1:
        unitData.addressLine1?.trim(),

      addressLine2:
        unitData.addressLine2?.trim(),

      country:
        unitData.country?.trim(),

      pincode:
        unitData.pincode?.trim(),

      status:
        unitData.status,

      company: {
        connect: {
          id:
            companyId,
        },
      },

      ...(parentId !==
        undefined && {
        parent: {
          connect: {
            id:
              parentId,
          },
        },
      }),

      ...(stateId !==
        undefined && {
        state: {
          connect: {
            id:
              stateId,
          },
        },
      }),

      ...(cityId !==
        undefined && {
        city: {
          connect: {
            id:
              cityId,
          },
        },
      }),
    };

    const organizationUnit =
      await this.organizationUnitRepository.create(
        createData,
      );

    return {
      message:
        "Organization unit created successfully.",

      organizationUnit,
    };
  }

  async findAll(
    user: AuthUser,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );

    const organizationUnits =
      await this.organizationUnitRepository.findAll(
        companyId,
      );

    return {
      message:
        "Organization units fetched successfully.",

      organizationUnits,
    };
  }

  async findOne(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    return {
      message:
        "Organization unit fetched successfully.",

      organizationUnit,
    };
  }

  async update(
    user: AuthUser,
    uuid: string,
    dto: UpdateOrganizationUnitDto,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    const {
      parentUuid,
      stateUuid,
      cityUuid,
      code,
      name,
      ...unitData
    } = dto;

    let parentUpdate:
      | Prisma.OrganizationUnitUpdateInput["parent"]
      | undefined;

    let stateUpdate:
      | Prisma.OrganizationUnitUpdateInput["state"]
      | undefined;

    let cityUpdate:
      | Prisma.OrganizationUnitUpdateInput["city"]
      | undefined;

    /*
     * Parent change.
     */
    if (
      parentUuid !== undefined
    ) {
      if (!parentUuid) {
        parentUpdate = {
          disconnect:
            true,
        };
      } else {
        const parent =
          await this.organizationUnitRepository.findByUuid(
            companyId,
            parentUuid,
          );

        if (!parent) {
          throw new NotFoundException(
            "Parent organization unit not found.",
          );
        }

        if (
          parent.id ===
          organizationUnit.id
        ) {
          throw new BadRequestException(
            "Organization unit cannot be its own parent.",
          );
        }

        parentUpdate = {
          connect: {
            id:
              parent.id,
          },
        };
      }
    }

    /*
     * Effective state starts from
     * existing OU state.
     */
    let effectiveStateId =
      organizationUnit.stateId ??
      undefined;

    if (
      stateUuid !== undefined
    ) {
      if (!stateUuid) {
        effectiveStateId =
          undefined;

        stateUpdate = {
          disconnect:
            true,
        };

        /*
         * State remove karne par existing
         * city bhi remove kar do.
         */
        if (
          cityUuid === undefined
        ) {
          cityUpdate = {
            disconnect:
              true,
          };
        }
      } else {
        const state =
          await this.stateRepository.findByUuid(
            stateUuid,
          );

        if (!state) {
          throw new NotFoundException(
            "State not found.",
          );
        }

        effectiveStateId =
          state.id;

        stateUpdate = {
          connect: {
            id:
              state.id,
          },
        };
      }
    }

    /*
     * City change.
     *
     * Agar state DTO me nahi badli,
     * existing OU state ke against bhi
     * validation hogi.
     */
    if (
      cityUuid !== undefined
    ) {
      if (!cityUuid) {
        cityUpdate = {
          disconnect:
            true,
        };
      } else {
        const city =
          await this.cityRepository.findByUuid(
            cityUuid,
          );

        if (!city) {
          throw new NotFoundException(
            "City not found.",
          );
        }

        if (
          effectiveStateId !==
            undefined &&
          city.stateId !==
            effectiveStateId
        ) {
          throw new BadRequestException(
            "Selected city does not belong to the selected state.",
          );
        }

        cityUpdate = {
          connect: {
            id:
              city.id,
          },
        };
      }
    } else if (
      stateUuid !== undefined &&
      effectiveStateId !==
        undefined &&
      organizationUnit.cityId
    ) {
      /*
       * State change hui but city nahi.
       *
       * Existing city new state me belong
       * karti hai ya nahi validate karo.
       */
       if (
          organizationUnit.city &&
          organizationUnit.city.stateId !==
            effectiveStateId
        ) {
          cityUpdate = {
            disconnect:
              true,
          };
        }
    }

    const normalizedCode =
      code !== undefined
        ? code
            .trim()
            .toUpperCase()
        : undefined;

    const normalizedName =
      name !== undefined
        ? name.trim()
        : undefined;

    if (
      normalizedCode !==
        undefined &&
      normalizedCode !==
        organizationUnit.code
    ) {
      const duplicateCode =
        await this.organizationUnitRepository.findByCode(
          companyId,
          normalizedCode,
        );

      if (
        duplicateCode &&
        duplicateCode.id !==
          organizationUnit.id
      ) {
        throw new ConflictException(
          "Organization unit code already exists.",
        );
      }
    }

    if (
      normalizedName !==
        undefined &&
      normalizedName !==
        organizationUnit.name
    ) {
      const duplicateName =
        await this.organizationUnitRepository.findByName(
          companyId,
          normalizedName,
        );

      if (
        duplicateName &&
        duplicateName.id !==
          organizationUnit.id
      ) {
        throw new ConflictException(
          "Organization unit name already exists.",
        );
      }
    }

    const updateData:
      Prisma.OrganizationUnitUpdateInput = {
      ...unitData,

      ...(normalizedCode !==
        undefined && {
        code:
          normalizedCode,
      }),

      ...(normalizedName !==
        undefined && {
        name:
          normalizedName,
      }),

      ...(parentUpdate !==
        undefined && {
        parent:
          parentUpdate,
      }),

      ...(stateUpdate !==
        undefined && {
        state:
          stateUpdate,
      }),

      ...(cityUpdate !==
        undefined && {
        city:
          cityUpdate,
      }),
    };

    const updatedOrganizationUnit =
      await this.organizationUnitRepository.update(
        companyId,
        uuid,
        updateData,
      );

    if (!updatedOrganizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    return {
      message:
        "Organization unit updated successfully.",

      organizationUnit:
        updatedOrganizationUnit,
    };
  }

  async delete(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.getCompanyId(
        user,
      );

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    const children =
      await this.organizationUnitRepository.findChildren(
        companyId,
        organizationUnit.id,
      );

    if (
      children.length >
      0
    ) {
      throw new ConflictException(
        "Cannot delete organization unit because child units exist.",
      );
    }

    const deleted =
      await this.organizationUnitRepository.softDelete(
        companyId,
        uuid,
      );

    if (!deleted) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    return {
      message:
        "Organization unit deleted successfully.",
    };
  }
}