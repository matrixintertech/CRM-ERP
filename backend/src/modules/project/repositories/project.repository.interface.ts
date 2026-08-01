import { Prisma } from '@prisma/client';

import { ProjectQueryDto } from '../dto';

import type {
  ProjectWithRelations,
} from '../types/project.types';

export interface IProjectRepository {
  create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<ProjectWithRelations>;

  findAll(
    companyId: bigint | null,
    query: ProjectQueryDto,
  ): Promise<{
    projects: ProjectWithRelations[];
    total: number;
  }>;

  count(
    companyId: bigint | null,
  ): Promise<number>;

  findByUuid(
    companyId: bigint | null,
    uuid: string,
  ): Promise<ProjectWithRelations | null>;

  findBySRN(
    companyId: bigint,
    srn: string,
  ): Promise<ProjectWithRelations | null>;

  update(
    companyId: bigint | null,
    uuid: string,
    data: Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations>;

  delete(
    companyId: bigint | null,
    uuid: string,
  ): Promise<void>;
}