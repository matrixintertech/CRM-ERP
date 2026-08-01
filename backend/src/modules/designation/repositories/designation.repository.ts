import { Injectable } from "@nestjs/common";

import {
  Prisma,
  Designation,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class DesignationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.DesignationCreateInput,
  ): Promise<Designation> {
    return this.prisma.designation.create({
      data,
    });
  }


  async findAll(
    companyId: bigint,
  ): Promise<Designation[]> {
    return this.prisma.designation.findMany({
      where: {
        companyId,
        deletedAt: null,
      },

      include: {
        department: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }


  async findById(
    companyId: bigint,
    id: bigint,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },

      include: {
        department: true,
      },
    });
  }


  async findByUuid(
    companyId: bigint,
    uuid: string,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },

      include: {
        department: true,
      },
    });
  }


  async findByName(
    companyId: bigint,
    departmentId: bigint,
    name: string,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        name,
        deletedAt: null,
      },
    });
  }


  async findByCode(
    companyId: bigint,
    departmentId: bigint,
    code: string,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        code,
        deletedAt: null,
      },
    });
  }


  async update(
    id: bigint,
    data: Prisma.DesignationUpdateInput,
  ): Promise<Designation> {
    return this.prisma.designation.update({
      where: {
        id,
      },

      data,
    });
  }


  async softDelete(
    id: bigint,
  ): Promise<Designation> {
    return this.prisma.designation.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}