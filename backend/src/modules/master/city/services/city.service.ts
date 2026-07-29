import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  CityDropdownDto,
  CityQueryDto,
  CreateCityDto,
  UpdateCityDto,
} from "../dto";

import { CityRepository } from "../repositories/city.repository";

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
  ) {}

  async create(
    dto: CreateCityDto,
  ) {
    const existingCity =
      await this.cityRepository.findByName(
        dto.name,
        dto.stateUuid,
      );

    if (existingCity) {
      throw new ConflictException(
        "City already exists in this state.",
      );
    }

    const city =
      await this.cityRepository.create(
        dto,
      );

    return {
      city,
    };
  }

  async findAll(
    query: CityQueryDto,
  ) {
    const {
      data,
      total,
    } =
      await this.cityRepository.findAll(
        query,
      );

    return {
      cities: data,
      total,
    };
  }

  async findDropdown(
    query: CityDropdownDto,
  ) {
    const cities =
      await this.cityRepository.findDropdown(
        query,
      );

    return {
      cities,
    };
  }

  async findByUuid(
    uuid: string,
  ) {
    const city =
      await this.cityRepository.findByUuid(
        uuid,
      );

    if (!city) {
      throw new NotFoundException(
        "City not found.",
      );
    }

    return {
      city,
    };
  }

  async update(
    uuid: string,
    dto: UpdateCityDto,
  ) {
    const city =
      await this.cityRepository.findByUuid(
        uuid,
      );

    if (!city) {
      throw new NotFoundException(
        "City not found.",
      );
    }

    if (
      dto.name &&
      (dto.name !== city.name ||
        dto.stateUuid)
    ) {
      const existingCity =
        await this.cityRepository.findByName(
          dto.name,
          dto.stateUuid ??
            city.state.uuid,
        );

      if (
        existingCity &&
        existingCity.uuid !== uuid
      ) {
        throw new ConflictException(
          "City already exists in this state.",
        );
      }
    }

    const updatedCity =
      await this.cityRepository.update(
        uuid,
        dto,
      );

    return {
      city: updatedCity,
    };
  }

  async remove(
    uuid: string,
  ) {
    const city =
      await this.cityRepository.findByUuid(
        uuid,
      );

    if (!city) {
      throw new NotFoundException(
        "City not found.",
      );
    }

    await this.cityRepository.softDelete(
      uuid,
    );

    return {};
  }
}