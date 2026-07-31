import { Injectable } from "@nestjs/common";
import { Prisma, Designation } from "@prisma/client";
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DesignationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DesignationCreateInput): Promise<Designation> {
    return this.prisma.designation.create({ data });
  }

  async findAll(companyId: number): Promise<Designation[]> {
    return this.prisma.designation.findMany({
      where: {
        companyId: BigInt(companyId),
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(
    companyId: number,
    id: number,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        id: BigInt(id),
        companyId: BigInt(companyId),
        deletedAt: null,
      },
    });
  }

  async findByName(
    companyId: number,
    name: string,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        companyId: BigInt(companyId),
        name,
        deletedAt: null,
      },
    });
  }

  async findByCode(
    companyId: number,
    code: string,
  ): Promise<Designation | null> {
    return this.prisma.designation.findFirst({
      where: {
        companyId: BigInt(companyId),
        code,
        deletedAt: null,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.DesignationUpdateInput,
  ): Promise<Designation> {
    return this.prisma.designation.update({
      where: {
        id: BigInt(id),
      },
      data,
    });
  }

  async softDelete(id: number): Promise<Designation> {
    return this.prisma.designation.update({
      where: {
        id: BigInt(id),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findByUuid(
  companyId: bigint,
  uuid: string,
) {
  return this.prisma.designation.findFirst({
    where: {
      companyId,
      uuid,
      deletedAt: null,
    },
  });
}
}