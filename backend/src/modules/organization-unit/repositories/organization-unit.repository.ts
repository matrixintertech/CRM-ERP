import { Injectable } from '@nestjs/common';

import {
  OrganizationUnit,
  Prisma,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrganizationUnitRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.OrganizationUnitCreateInput,
  ): Promise<OrganizationUnit> {
    return this.prisma.organizationUnit.create({
      data,
    });
  }


  async findAllByCompanyId(
  companyId: bigint,
) {
  return this.prisma.organizationUnit.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findById(
  id: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}


async update(
  id: bigint,
  data: Prisma.OrganizationUnitUpdateInput,
) {
  return this.prisma.organizationUnit.update({
    where: {
      id,
    },
    data,
  });
}


async findChildren(
  parentId: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      parentId,
      deletedAt: null,
    },
  });
}


async delete(id: bigint) {
  return this.prisma.organizationUnit.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}



  async findCompanyById(
  id: bigint,
) {
  return this.prisma.company.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

async findParentById(
  id: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

async findByCode(
  code: string,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      code,
      deletedAt: null,
    },
  });
}

async findByName(
  name: string,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      name,
      deletedAt: null,
    },
  });
}
}