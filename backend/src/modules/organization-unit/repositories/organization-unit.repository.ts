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
  companyId: bigint,
  id: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      id,
      companyId,
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
  companyId: bigint,
  parentId: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      companyId,
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
  companyId: bigint,
  id: bigint,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      id,
      companyId,
      deletedAt: null,
    },
  });
}

async findByCode(
  companyId: bigint,
  code: string,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      companyId,
      code,
      deletedAt: null,
    },
  });
}

async findByName(
  companyId: bigint,
  name: string,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      companyId,
      name,
      deletedAt: null,
    },
  });
}

async findAllByCompany(
  companyId: bigint,
): Promise<OrganizationUnit[]> {
  return this.prisma.organizationUnit.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    orderBy: [
      {
        type: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}


async findByUuid(
  companyId: bigint,
  uuid: string,
) {
  return this.prisma.organizationUnit.findFirst({
    where: {
      companyId,
      uuid,
      deletedAt: null,
    },
  });
}


}