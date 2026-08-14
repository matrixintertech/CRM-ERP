import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";


@Injectable()
export class ModuleRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  create(
    data:
      Prisma.ModuleCreateInput,
  ) {
    return this.prisma.module.create({
      data,
    });
  }


  findAll() {
    return this.prisma.module.findMany({
      where: {
        deletedAt:
          null,
      },

      include: {
        parent: {
          select: {
            id:
              true,

            uuid:
              true,

            name:
              true,
          },
        },
      },

      orderBy: [
        {
          sortOrder:
            "asc",
        },
        {
          name:
            "asc",
        },
      ],
    });
  }


  findById(
    id: bigint,
  ) {
    return this.prisma.module.findFirst({
      where: {
        id,

        deletedAt:
          null,
      },

      include: {
        parent:
          true,

        children:
          true,
      },
    });
  }


  findByUuid(
    uuid: string,
  ) {
    return this.prisma.module.findFirst({
      where: {
        uuid,

        deletedAt:
          null,
      },
    });
  }


  /*
   * Subscription Plan module assignment
   * validation ke liye.
   *
   * Sirf ACTIVE + non-deleted modules
   * assignable honge.
   */
  findByIds(
    ids: string[],
  ) {
    const moduleIds =
      ids.map(
        (id) =>
          BigInt(id),
      );

    return this.prisma.module.findMany({
      where: {
        id: {
          in:
            moduleIds,
        },

        deletedAt:
          null,

        status:
          Status.ACTIVE,
      },

      select: {
        id:
          true,

        uuid:
          true,

        name:
          true,

        code:
          true,

        status:
          true,
      },
    });
  }


  findByCode(
    code: string,
  ) {
    return this.prisma.module.findFirst({
      where: {
        code,

        deletedAt:
          null,
      },
    });
  }


  findByName(
    name: string,
  ) {
    return this.prisma.module.findFirst({
      where: {
        name,

        deletedAt:
          null,
      },
    });
  }


  update(
    id: bigint,
    data:
      Prisma.ModuleUpdateInput,
  ) {
    return this.prisma.module.update({
      where: {
        id,
      },

      data,

      include: {
        parent:
          true,

        children:
          true,
      },
    });
  }


  softDelete(
    id: bigint,
  ) {
    return this.prisma.module.update({
      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },
    });
  }


  findParents() {
    return this.prisma.module.findMany({
      where: {
        deletedAt:
          null,
      },

      select: {
        id:
          true,

        uuid:
          true,

        name:
          true,
      },

      orderBy: {
        sortOrder:
          "asc",
      },
    });
  }
}