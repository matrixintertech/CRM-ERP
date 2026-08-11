import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CompanyBoundaryService,
} from 'src/modules/authorization/services/company-boundary.service';

import {
  ClientDropdownDto,
  ClientQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from '../dto';

import {
  ClientRepository,
} from '../repositories/client.repository';

import {
  StateRepository,
} from '../../master/state/repositories/state.repository';

import {
  CityRepository,
} from '../../master/city/repositories/city.repository';

interface AuthUser {
  id: bigint;
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

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

  private async resolveLocationIds(
    stateUuid?: string,
    cityUuid?: string,
  ) {
    let stateId:
      bigint | undefined;

    let cityId:
      bigint | undefined;

    if (stateUuid) {
      const state =
        await this.stateRepository
          .findByUuid(
            stateUuid,
          );

      if (!state) {
        throw new NotFoundException(
          'State not found.',
        );
      }

      stateId =
        state.id;
    }

    if (cityUuid) {
      const city =
        await this.cityRepository
          .findByUuid(
            cityUuid,
          );

      if (!city) {
        throw new NotFoundException(
          'City not found.',
        );
      }

      if (
        stateId &&
        city.stateId !==
          stateId
      ) {
        throw new BadRequestException(
          'Selected city does not belong to the selected state.',
        );
      }

      cityId =
        city.id;
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
      stateUuid,
      cityUuid,
      code,
      ...clientData
    } = dto;

    /*
     * Client hamesha authenticated
     * user's company me create hoga.
     */
    const companyId =
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    const normalizedCode =
      code
        .trim()
        .toUpperCase();

    const existingClient =
      await this.clientRepository
        .findByCode(
          companyId,
          normalizedCode,
        );

    if (existingClient) {
      throw new ConflictException(
        'Client code already exists.',
      );
    }

    const {
      stateId,
      cityId,
    } =
      await this.resolveLocationIds(
        stateUuid,
        cityUuid,
      );

    const client =
      await this.clientRepository
        .create({
          companyId,

          code:
            normalizedCode,

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
        'Client created successfully.',

      client,
    };
  }

  async findAll(
    user: AuthUser,
    query: ClientQueryDto,
  ) {
    const companyId =
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    return this.clientRepository
      .findAll(
        companyId,
        query,
      );
  }

  async findDropdown(
    user: AuthUser,
    query: ClientDropdownDto,
  ) {
    const companyId =
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    return this.clientRepository
      .findDropdown(
        companyId,
        query,
      );
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    const client =
      await this.clientRepository
        .findByUuid(
          companyId,
          uuid,
        );

    if (!client) {
      throw new NotFoundException(
        'Client not found.',
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
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    const client =
      await this.clientRepository
        .findByUuid(
          companyId,
          uuid,
        );

    if (!client) {
      throw new NotFoundException(
        'Client not found.',
      );
    }

    const {
      stateUuid,
      cityUuid,
      code,
      ...clientData
    } = dto;

    const normalizedCode =
      code
        ?.trim()
        .toUpperCase();

    if (
      normalizedCode &&
      normalizedCode !==
        client.code
    ) {
      const existingClient =
        await this.clientRepository
          .findByCode(
            companyId,
            normalizedCode,
          );

      if (
        existingClient &&
        existingClient.uuid !==
          client.uuid
      ) {
        throw new ConflictException(
          'Client code already exists.',
        );
      }
    }

    const {
      stateId,
      cityId,
    } =
      await this.resolveLocationIds(
        stateUuid,
        cityUuid,
      );

    const updatedClient =
      await this.clientRepository
        .update(
          companyId,
          uuid,
          {
            ...clientData,

            ...(normalizedCode && {
              code:
                normalizedCode,
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
        'Client updated successfully.',

      client:
        updatedClient,
    };
  }

  async remove(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      await this.companyBoundaryService
        .getCompanyId(
          user.id,
        );

    const client =
      await this.clientRepository
        .findByUuid(
          companyId,
          uuid,
        );

    if (!client) {
      throw new NotFoundException(
        'Client not found.',
      );
    }

    await this.clientRepository
      .softDelete(
        companyId,
        uuid,
      );

    return {
      message:
        'Client deleted successfully.',
    };
  }
}