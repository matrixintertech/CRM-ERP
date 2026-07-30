import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import {
  ClientDropdownDto,
  ClientQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from '../dto';

import { ClientRepository } from '../repositories/client.repository';
import { StateRepository } from '../../master/state/repositories/state.repository';
import { CityRepository } from '../../master/city/repositories/city.repository';



@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
     private readonly stateRepository: StateRepository,
    private readonly cityRepository: CityRepository,
  ) {}

async create(
  companyId: bigint,
  dto: CreateClientDto,
) {
  const {
    companyUuid, // ignore for now
    stateUuid,
    cityUuid,
    code,
    ...clientData
  } = dto;

  // Check duplicate code
  if (code) {
    const existingClient = await this.clientRepository.findByCode(
      companyId,
      code,
    );

    if (existingClient) {
      throw new ConflictException(
        'Client code already exists.',
      );
    }
  }

  let stateId: bigint | undefined;
  let cityId: bigint | undefined;

  if (stateUuid) {
    const state = await this.stateRepository.findByUuid(stateUuid);

    if (!state) {
      throw new NotFoundException('State not found.');
    }

    stateId = state.id;
  }

  if (cityUuid) {
    const city = await this.cityRepository.findByUuid(cityUuid);

    if (!city) {
      throw new NotFoundException('City not found.');
    }

    cityId = city.id;
  }

  const client = await this.clientRepository.create({
    companyId,
    code,
    ...clientData,
    ...(stateId && { stateId }),
    ...(cityId && { cityId }),
  });

  return {
    client,
  };
}

  async findAll(
    companyId: bigint,
    query: ClientQueryDto,
  ) {
    return this.clientRepository.findAll(companyId, query);
  }

  async findDropdown(
    companyId: bigint,
    query: ClientDropdownDto,
  ) {
    return this.clientRepository.findDropdown(companyId, query);
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    const client = await this.clientRepository.findByUuid(
      companyId,
      uuid,
    );

    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return {
      client,
    };
  }

async update(
  companyId: bigint,
  uuid: string,
  dto: UpdateClientDto,
) {
  // Check client exists
  const client = await this.clientRepository.findByUuid(
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

  // Check duplicate code
  if (code && code !== client.code) {
    const existingClient =
      await this.clientRepository.findByCode(
        companyId,
        code,
      );

    if (
      existingClient &&
      existingClient.uuid !== client.uuid
    ) {
      throw new ConflictException(
        'Client code already exists.',
      );
    }
  }

  let stateId: bigint | undefined;
  let cityId: bigint | undefined;

  if (stateUuid) {
    const state =
      await this.stateRepository.findByUuid(
        stateUuid,
      );

    if (!state) {
      throw new NotFoundException(
        'State not found.',
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
        'City not found.',
      );
    }

    cityId = city.id;
  }

  const updatedClient =
    await this.clientRepository.update(
      companyId,
      uuid,
      {
        ...(code && { code }),
        ...clientData,
        ...(stateId && { stateId }),
        ...(cityId && { cityId }),
      },
    );

  return {
    client: updatedClient,
  };
}

  async remove(
    companyId: bigint,
    uuid: string,
  ) {
    throw new Error('Method not implemented.');
  }


 
}