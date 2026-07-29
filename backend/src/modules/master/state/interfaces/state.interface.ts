import { Prisma, State } from "@prisma/client";
import { CreateStateDto } from "../dto/create-state.dto";
import { StateDropdownDto } from "../dto/state-dropdown.dto";
import { StateQueryDto } from "../dto/state-query.dto";
import { UpdateStateDto } from "../dto/update-state.dto";

export interface IStateRepository {
  create(
    dto: CreateStateDto,
  ): Promise<State>;

  findAll(
    query: StateQueryDto,
  ): Promise<{
    data: State[];
    total: number;
  }>;

  findDropdown(
    query: StateDropdownDto,
  ): Promise<Partial<State>[]>;

  findByUuid(
    uuid: string,
  ): Promise<State | null>;

  findByName(
    name: string,
  ): Promise<State | null>;

  findByCode(
    code: string,
  ): Promise<State | null>;

  update(
    uuid: string,
    dto: UpdateStateDto,
  ): Promise<State>;

  softDelete(
    uuid: string,
  ): Promise<State>;
}