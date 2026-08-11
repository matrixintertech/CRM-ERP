import {
  Prisma,
} from '@prisma/client';

import {
  ProjectQueryDto,
} from '../dto';

import type {
  ProjectWithRelations,
} from '../types/project.types';

export interface IProjectRepository {
  create(
    data:
      Prisma.ProjectUncheckedCreateInput,
  ): Promise<ProjectWithRelations>;

  findAll(
    companyId: bigint,
    query: ProjectQueryDto,
    scopeWhere?:
      Prisma.ProjectWhereInput,
  ): Promise<{
    projects:
      ProjectWithRelations[];

    total: number;
  }>;

  count(
    companyId: bigint,
  ): Promise<number>;

  /*
   * Current company + year ka
   * latest generated SRN.
   *
   * Soft deleted project bhi consider
   * hoga, taaki SRN reuse na ho.
   */
  findLatestSRN(
    companyId: bigint,
    year: number,
  ): Promise<{
    srn: string;
  } | null>;

  findByUuid(
    companyId: bigint,
    uuid: string,
    scopeWhere?:
      Prisma.ProjectWhereInput,
  ): Promise<ProjectWithRelations | null>;

  findBySRN(
    companyId: bigint,
    srn: string,
  ): Promise<ProjectWithRelations | null>;

  update(
    companyId: bigint,
    uuid: string,
    data:
      Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations>;

  delete(
    companyId: bigint,
    uuid: string,
  ): Promise<void>;
}