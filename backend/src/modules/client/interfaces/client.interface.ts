import { Prisma } from '@prisma/client';

import { ClientDropdownDto, ClientQueryDto } from '../dto';
import { ClientWithRelations } from '../repositories/client.repository';

export interface IClientRepository {
  create(
    data: Prisma.ClientUncheckedCreateInput,
  ): Promise<ClientWithRelations>;

  findAll(
    companyId: bigint,
    query: ClientQueryDto,
  ): Promise<{
    clients: ClientWithRelations[];
    total: number;
  }>;

  findDropdown(
    companyId: bigint,
    query: ClientDropdownDto,
  ): Promise<
    {
      uuid: string;
      name: string;
    }[]
  >;

  findByUuid(
    companyId: bigint,
    uuid: string,
  ): Promise<ClientWithRelations | null>;

  findByCode(
    companyId: bigint,
    code: string,
  ): Promise<ClientWithRelations | null>;

  update(
    companyId: bigint,
    uuid: string,
    data: Prisma.ClientUncheckedUpdateInput,
  ): Promise<ClientWithRelations>;

  softDelete(
    companyId: bigint,
    uuid: string,
  ): Promise<ClientWithRelations>;
}