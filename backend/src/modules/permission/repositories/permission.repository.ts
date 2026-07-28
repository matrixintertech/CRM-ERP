import { Injectable } from "@nestjs/common";

import { PrismaService } from 'src/database/prisma.service';

import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";

@Injectable()
export class PermissionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: CreatePermissionDto,
  ) {
    return this.prisma.permission.create({
      data,
    });
  }

  findAll() {
    return this.prisma.permission.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        module: "asc",
      },
    });
  }

  findById(
    id: bigint,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  findByCode(
    code: string,
  ) {
    return this.prisma.permission.findUnique({
      where: {
        code,
      },
    });
  }

  update(
    id: bigint,
    data: UpdatePermissionDto,
  ) {
    return this.prisma.permission.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: bigint,
  ) {
    return this.prisma.permission.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }


  async findGrouped() {
  return this.prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [
      {
        module: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}
}