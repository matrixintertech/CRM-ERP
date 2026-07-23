import { Injectable } from '@nestjs/common';
import { Prisma, Company } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CompanyRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.CompanyCreateInput,
  ): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

    async findByCode(
    code: string,
    ) {
    return this.prisma.company.findUnique({
        where: {
        code,
        },
    });
    }

    async findByEmail(
    email: string,
    ) {
    return this.prisma.company.findUnique({
        where: {
        email,
        },
    });
    }


        async findByMobile(
    mobile: string,
    ) {
    return this.prisma.company.findUnique({
        where: {
        mobile,
        },
    });
    }
}