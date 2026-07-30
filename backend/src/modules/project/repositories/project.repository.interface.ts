import { Prisma } from '@prisma/client';

import { ProjectWithRelations } from '../types/project.types';
import { ProjectQueryDto } from '../dto';

export interface IProjectRepository {
  create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<ProjectWithRelations>;

 findAll(
  companyId: bigint,
  query: ProjectQueryDto,
): Promise<{
  projects: ProjectWithRelations[];
  total: number;
}>;

  count(
    companyId: bigint,
  ): Promise<number>;

  findByUuid(
    companyId: bigint,
    uuid: string,
  ): Promise<ProjectWithRelations | null>;

  findBySRN(
    companyId: bigint,
    srn: string,
  ): Promise<ProjectWithRelations | null>;

  update(
    companyId: bigint,
    uuid: string,
    data: Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations>;

  delete(
    companyId: bigint,
    uuid: string,
  ): Promise<void>;
}