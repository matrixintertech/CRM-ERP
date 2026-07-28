import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Status,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ModuleRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.ModuleCreateInput,
  ) {
    return this.prisma.module.create({
      data,
    });
  }

  findAll() {
    return this.prisma.module.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  findById(id: bigint) {
    return this.prisma.module.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  findByCode(code: string) {
    return this.prisma.module.findFirst({
      where: {
        code,
        deletedAt: null,
      },
    });
  }

  findByName(name: string) {
    return this.prisma.module.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  update(
    id: bigint,
    data: Prisma.ModuleUpdateInput,
  ) {
    return this.prisma.module.update({
      where: {
        id,
      },
      data,
    });
  }

  softDelete(id: bigint) {
    return this.prisma.module.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: Status.INACTIVE,
      },
    });
  }
}