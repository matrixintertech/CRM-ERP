import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  UserType,
} from "@prisma/client";

import {
  ClientDropdownDto,
  ClientQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from "../dto";

import { ClientRepository } from "../repositories/client.repository";
import { StateRepository } from "../../master/state/repositories/state.repository";
import { CityRepository } from "../../master/city/repositories/city.repository";
import { CompanyRepository } from "../../company/repositories/company.repository";

interface AuthUser {
  id: bigint;
  companyId: bigint | null;
  userType: UserType;
}

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository:
      ClientRepository,

    private readonly stateRepository:
      StateRepository,

    private readonly cityRepository:
      CityRepository,

    private readonly companyRepository:
      CompanyRepository,
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

  private async resolveLocationIds(
    stateUuid?: string,
    cityUuid?: string,
  ) {
    let stateId: bigint | undefined;
    let cityId: bigint | undefined;

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
        stateId &&
        city.stateId !== stateId
      ) {
        throw new BadRequestException(
          "Selected city does not belong to the selected state.",
        );
      }

      cityId = city.id;
    }

    return {
      stateId,
      cityId,
    };
  }

  async create(
    user: AuthUser,
    dto: CreateClientDto,
  ) {
    const {
      companyUuid,
      stateUuid,
      cityUuid,
      code,
      ...clientData
    } = dto;

    const companyId =
      await this.resolveCompanyId(
        user,
        companyUuid,
      );

    const normalizedCode = code
      .trim()
      .toUpperCase();

    const existingClient =
      await this.clientRepository.findByCode(
        companyId,
        normalizedCode,
      );

    if (existingClient) {
      throw new ConflictException(
        "Client code already exists.",
      );
    }

    const {
      stateId,
      cityId,
    } = await this.resolveLocationIds(
      stateUuid,
      cityUuid,
    );

    const client =
      await this.clientRepository.create({
        companyId,
        code: normalizedCode,
        ...clientData,

        ...(stateId !== undefined && {
          stateId,
        }),

        ...(cityId !== undefined && {
          cityId,
        }),
      });

    return {
      message:
        "Client created successfully.",
      client,
    };
  }

  async findAll(
    user: AuthUser,
    query: ClientQueryDto,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    return this.clientRepository.findAll(
      companyId,
      query,
    );
  }

  async findDropdown(
    user: AuthUser,
    query: ClientDropdownDto,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    return this.clientRepository.findDropdown(
      companyId,
      query,
    );
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const client =
      await this.clientRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!client) {
      throw new NotFoundException(
        "Client not found.",
      );
    }

    return {
      client,
    };
  }

  async update(
    user: AuthUser,
    uuid: string,
    dto: UpdateClientDto,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const client =
      await this.clientRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!client) {
      throw new NotFoundException(
        "Client not found.",
      );
    }

    const {
      stateUuid,
      cityUuid,
      code,
      ...clientData
    } = dto;

    const normalizedCode =
      code?.trim().toUpperCase();

    if (
      normalizedCode &&
      normalizedCode !== client.code
    ) {
      const existingClient =
        await this.clientRepository.findByCode(
          client.companyId,
          normalizedCode,
        );

      if (
        existingClient &&
        existingClient.uuid !==
          client.uuid
      ) {
        throw new ConflictException(
          "Client code already exists.",
        );
      }
    }

    const {
      stateId,
      cityId,
    } = await this.resolveLocationIds(
      stateUuid,
      cityUuid,
    );

    const updatedClient =
      await this.clientRepository.update(
        companyId,
        uuid,
        {
          ...clientData,

          ...(normalizedCode && {
            code: normalizedCode,
          }),

          ...(stateId !== undefined && {
            stateId,
          }),

          ...(cityId !== undefined && {
            cityId,
          }),
        },
      );

    return {
      message:
        "Client updated successfully.",
      client: updatedClient,
    };
  }

  async remove(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const client =
      await this.clientRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!client) {
      throw new NotFoundException(
        "Client not found.",
      );
    }

    await this.clientRepository.softDelete(
      companyId,
      uuid,
    );

    return {
      message:
        "Client deleted successfully.",
    };
  }
}