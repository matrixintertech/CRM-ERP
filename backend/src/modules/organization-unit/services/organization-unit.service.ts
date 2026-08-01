import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
  UserType,
} from "@prisma/client";

import { CreateOrganizationUnitDto } from "../dto/create-organization-unit.dto";
import { UpdateOrganizationUnitDto } from "../dto/update-organization-unit.dto";

import { OrganizationUnitRepository } from "../repositories/organization-unit.repository";
import { CompanyRepository } from "../../company/repositories/company.repository";

import { StateRepository } from "../../master/state/repositories/state.repository";
import { CityRepository } from "../../master/city/repositories/city.repository";

interface AuthUser {
  id: bigint;
  companyId: bigint | null;
  userType: UserType;
}

@Injectable()
export class OrganizationUnitService {
  constructor(
    private readonly organizationUnitRepository:
      OrganizationUnitRepository,

    private readonly companyRepository:
      CompanyRepository,

       private readonly stateRepository:
    StateRepository,

  private readonly cityRepository:
    CityRepository,
  ) {}

  private isPlatformOwner(
    user: AuthUser,
  ): boolean {
    return (
      user.userType ===
      UserType.PLATFORM_OWNER
    );
  }

  private getUserCompanyId(
    user: AuthUser,
  ): bigint {
    if (!user.companyId) {
      throw new ForbiddenException(
        "Company context is missing.",
      );
    }

    return user.companyId;
  }

  private async resolveCompanyId(
    user: AuthUser,
    companyUuid?: string,
  ): Promise<bigint> {
    if (!this.isPlatformOwner(user)) {
      return this.getUserCompanyId(user);
    }

    if (!companyUuid) {
      throw new BadRequestException(
        "Company is required for platform owner.",
      );
    }

    const company =
      await this.companyRepository.findByUuid(
        companyUuid,
      );

    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }

    return company.id;
  }

async create(
  user: AuthUser,
  dto: CreateOrganizationUnitDto,
) {
  const {
    companyUuid,
    parentUuid,
    stateUuid,
    cityUuid,
    code,
    name,
    ...unitData
  } = dto;

  const companyId =
    await this.resolveCompanyId(
      user,
      companyUuid,
    );

  let parentId: bigint | undefined;
  let stateId: bigint | undefined;
  let cityId: bigint | undefined;

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

    parentId = parent.id;
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

    stateId = state.id;
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

    cityId = city.id;
  }

  const normalizedCode = code
    .trim()
    .toUpperCase();

  const normalizedName = name.trim();

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
      name: normalizedName,
      code: normalizedCode,

      type: unitData.type,
      email: unitData.email,
      mobile: unitData.mobile,

      addressLine1:
        unitData.addressLine1,

      addressLine2:
        unitData.addressLine2,

      country: unitData.country,
      pincode: unitData.pincode,
      status: unitData.status,

      company: {
        connect: {
          id: companyId,
        },
      },

      ...(parentId !== undefined
        ? {
            parent: {
              connect: {
                id: parentId,
              },
            },
          }
        : {}),

      ...(stateId !== undefined
        ? {
            state: {
              connect: {
                id: stateId,
              },
            },
          }
        : {}),

      ...(cityId !== undefined
        ? {
            city: {
              connect: {
                id: cityId,
              },
            },
          }
        : {}),
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
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

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
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

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
  const companyFilterId =
    this.isPlatformOwner(user)
      ? null
      : this.getUserCompanyId(user);

  const organizationUnit =
    await this.organizationUnitRepository.findByUuid(
      companyFilterId,
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

  if (parentUuid !== undefined) {
    if (!parentUuid) {
      parentUpdate = {
        disconnect: true,
      };
    } else {
      const parent =
        await this.organizationUnitRepository.findByUuid(
          organizationUnit.companyId,
          parentUuid,
        );

      if (!parent) {
        throw new NotFoundException(
          "Parent organization unit not found.",
        );
      }

      if (parent.uuid === uuid) {
        throw new BadRequestException(
          "Organization unit cannot be its own parent.",
        );
      }

      parentUpdate = {
        connect: {
          id: parent.id,
        },
      };
    }
  }

  let selectedStateId:
    | bigint
    | undefined;

  if (stateUuid !== undefined) {
    if (!stateUuid) {
      stateUpdate = {
        disconnect: true,
      };
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

      selectedStateId = state.id;

      stateUpdate = {
        connect: {
          id: state.id,
        },
      };
    }
  }

  if (cityUuid !== undefined) {
    if (!cityUuid) {
      cityUpdate = {
        disconnect: true,
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
        selectedStateId !== undefined &&
        city.stateId !== selectedStateId
      ) {
        throw new BadRequestException(
          "Selected city does not belong to the selected state.",
        );
      }

      cityUpdate = {
        connect: {
          id: city.id,
        },
      };
    }
  }

  const normalizedCode =
    code?.trim().toUpperCase();

  const normalizedName =
    name?.trim();

  if (
    normalizedCode &&
    normalizedCode !==
      organizationUnit.code
  ) {
    const duplicateCode =
      await this.organizationUnitRepository.findByCode(
        organizationUnit.companyId,
        normalizedCode,
      );

    if (
      duplicateCode &&
      duplicateCode.uuid !== uuid
    ) {
      throw new ConflictException(
        "Organization unit code already exists.",
      );
    }
  }

  if (
    normalizedName &&
    normalizedName !==
      organizationUnit.name
  ) {
    const duplicateName =
      await this.organizationUnitRepository.findByName(
        organizationUnit.companyId,
        normalizedName,
      );

    if (
      duplicateName &&
      duplicateName.uuid !== uuid
    ) {
      throw new ConflictException(
        "Organization unit name already exists.",
      );
    }
  }

  const updateData:
    Prisma.OrganizationUnitUpdateInput = {
      ...unitData,

      ...(normalizedCode !== undefined && {
        code: normalizedCode,
      }),

      ...(normalizedName !== undefined && {
        name: normalizedName,
      }),

      ...(parentUpdate !== undefined && {
        parent: parentUpdate,
      }),

      ...(stateUpdate !== undefined && {
        state: stateUpdate,
      }),

      ...(cityUpdate !== undefined && {
        city: cityUpdate,
      }),
    };

  const updatedOrganizationUnit =
    await this.organizationUnitRepository.update(
      companyFilterId,
      uuid,
      updateData,
    );

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
    const companyFilterId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyFilterId,
        uuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    const children =
      await this.organizationUnitRepository.findChildren(
        organizationUnit.companyId,
        organizationUnit.id,
      );

    if (children.length > 0) {
      throw new ConflictException(
        "Cannot delete organization unit because child units exist.",
      );
    }

    await this.organizationUnitRepository.delete(
      companyFilterId,
      uuid,
    );

    return {
      message:
        "Organization unit deleted successfully.",
    };
  }
}