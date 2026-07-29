import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  CreateStateDto,
  StateDropdownDto,
  StateQueryDto,
  UpdateStateDto,
} from "../dto";

import { StateRepository } from "../repositories/state.repository";

@Injectable()
export class StateService {
  constructor(
    private readonly stateRepository: StateRepository,
  ) {}

  async create(dto: CreateStateDto) {
    const existingName =
      await this.stateRepository.findByName(
        dto.name,
      );

    if (existingName) {
      throw new ConflictException(
        "State name already exists.",
      );
    }

    const existingCode =
      await this.stateRepository.findByCode(
        dto.code,
      );

    if (existingCode) {
      throw new ConflictException(
        "State code already exists.",
      );
    }

    const state =
      await this.stateRepository.create(
        dto,
      );

    return {
      state,
    };
  }

  async findAll(
    query: StateQueryDto,
  ) {
    const {
      data,
      total,
    } =
      await this.stateRepository.findAll(
        query,
      );

    return {
      states: data,
      total,
    };
  }

  async findDropdown(
    query: StateDropdownDto,
  ) {
    const states =
      await this.stateRepository.findDropdown(
        query,
      );

    return {
      states,
    };
  }

  async findByUuid(
    uuid: string,
  ) {
    const state =
      await this.stateRepository.findByUuid(
        uuid,
      );

    if (!state) {
      throw new NotFoundException(
        "State not found.",
      );
    }

    return {
      state,
    };
  }

  async update(
    uuid: string,
    dto: UpdateStateDto,
  ) {
    const state =
      await this.stateRepository.findByUuid(
        uuid,
      );

    if (!state) {
      throw new NotFoundException(
        "State not found.",
      );
    }

    if (
      dto.name &&
      dto.name !== state.name
    ) {
      const existingName =
        await this.stateRepository.findByName(
          dto.name,
        );

      if (
        existingName &&
        existingName.uuid !== uuid
      ) {
        throw new ConflictException(
          "State name already exists.",
        );
      }
    }

    if (
      dto.code &&
      dto.code !== state.code
    ) {
      const existingCode =
        await this.stateRepository.findByCode(
          dto.code,
        );

      if (
        existingCode &&
        existingCode.uuid !== uuid
      ) {
        throw new ConflictException(
          "State code already exists.",
        );
      }
    }

    const updatedState =
      await this.stateRepository.update(
        uuid,
        dto,
      );

    return {
      state: updatedState,
    };
  }

  async remove(
    uuid: string,
  ) {
    const state =
      await this.stateRepository.findByUuid(
        uuid,
      );

    if (!state) {
      throw new NotFoundException(
        "State not found.",
      );
    }

    await this.stateRepository.softDelete(
      uuid,
    );

    return {};
  }
}