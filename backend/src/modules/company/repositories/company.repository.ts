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


    async findAll(
  skip: number,
  take: number,
  search?: string,
) {
 return this.prisma.company.findMany({
  where: {
    deletedAt: null,
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          mobile: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    }),
  },

  select: {
    id: true,
    uuid: true,
    name: true,
    code: true,
    email: true,
    mobile: true,
    logo: true,
    status: true,
    createdAt: true,
  },

  orderBy: {
    createdAt: 'desc',
  },

  skip,
  take,
});
}


async count(
  search?: string,
) {
  return this.prisma.company.count({
    where: {
      deletedAt: null,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            mobile: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
  });
}


async findById(
  id: bigint,
) {
  return this.prisma.company.findFirst({
    where: {
      id,
      deletedAt: null,
    },

    select: {
      id: true,
      uuid: true,
      name: true,
      code: true,
      email: true,
      mobile: true,
      logo: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}


async update(
  id: bigint,
  data: Prisma.CompanyUpdateInput,
) {
  return this.prisma.company.update({
    where: {
      id,
    },
    data,
  });
}

async findByCodeExceptId(
  code: string,
  id: bigint,
) {
  return this.prisma.company.findFirst({
    where: {
      code,
      NOT: {
        id,
      },
    },
  });
}


async findByEmailExceptId(
  email: string,
  id: bigint,
) {
  return this.prisma.company.findFirst({
    where: {
      email,
      NOT: {
        id,
      },
    },
  });
}


async findByMobileExceptId(
  mobile: string,
  id: bigint,
) {
  return this.prisma.company.findFirst({
    where: {
      mobile,
      NOT: {
        id,
      },
    },
  });
}

//Delete
async softDelete(
  id: bigint,
) {
  return this.prisma.company.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}



}