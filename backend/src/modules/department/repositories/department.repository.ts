import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Status } from "@prisma/client";

import { PrismaService } from 'src/database/prisma.service';
import { CreateDepartmentDto } from "../dto/create-department.dto";
import { UpdateDepartmentDto } from "../dto/update-department.dto";

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: number, dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        companyId: BigInt(companyId),
        name: dto.name,
        code: dto.code,
        description: dto.description,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.department.findMany({
      where: {
        companyId: BigInt(companyId),
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(companyId: number, id: number) {
    return this.prisma.department.findFirst({
      where: {
        id: BigInt(id),
        companyId: BigInt(companyId),
        deletedAt: null,
      },
    });
  }

  async findByName(companyId: number, name: string) {
    return this.prisma.department.findFirst({
      where: {
        companyId: BigInt(companyId),
        name,
        deletedAt: null,
      },
    });
  }

  async findByCode(companyId: number, code: string) {
    return this.prisma.department.findFirst({
      where: {
        companyId: BigInt(companyId),
        code,
        deletedAt: null,
      },
    });
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: {
        id: BigInt(id),
      },
      data: dto,
    });
  }

  async softDelete(id: number) {
    return this.prisma.department.update({
      where: {
        id: BigInt(id),
      },
      data: {
        deletedAt: new Date(),
        status: Status.INACTIVE,
      },
    });
  }

async findByUuid(
  companyId: bigint,
  uuid: string,
) {
  return this.prisma.department.findFirst({
    where: {
      companyId,
      uuid,
      deletedAt: null,
    },
  });
}


}