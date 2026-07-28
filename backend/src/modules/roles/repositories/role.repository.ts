import { Injectable } from '@nestjs/common';

import {
  Prisma,
  Role,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.RoleCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Role> {
    return (tx ?? this.prisma).role.create({
      data,
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

  async findById(
    id: bigint,
  ) {
    return this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByCompanyId(
    companyId: bigint,
  ) {
    return this.prisma.role.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCode(
    companyId: bigint,
    code: string,
  ) {
    return this.prisma.role.findFirst({
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
    return this.prisma.role.findFirst({
      where: {
        companyId,
        name,
        deletedAt: null,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.RoleUpdateInput,
  ) {
    return this.prisma.role.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    id: bigint,
  ) {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findRolePermissions(
  roleId: bigint,
) {
  return this.prisma.rolePermission.findMany({
    where: {
      roleId,
    },
    select: {
      permissionId: true,
    },
  });
}


async assignPermissions(
  roleId: bigint,
  permissionIds: number[],
) {
  await this.prisma.rolePermission.deleteMany({
    where: {
      roleId,
    },
  });

  if (!permissionIds.length) {
    return;
  }

  await this.prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({
      roleId,
      permissionId: BigInt(permissionId),
    })),
  });
}


}