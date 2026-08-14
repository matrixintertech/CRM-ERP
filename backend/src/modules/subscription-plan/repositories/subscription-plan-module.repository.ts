import {
  Injectable,
} from "@nestjs/common";

import {
  PrismaService,
} from "src/database/prisma.service";


@Injectable()
export class SubscriptionPlanModuleRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  private normalizeModuleIds(
    moduleIds: string[],
  ): bigint[] {
    return [
      ...new Set(
        moduleIds,
      ),
    ].map(
      (moduleId) =>
        BigInt(moduleId),
    );
  }


  async createMany(
    subscriptionPlanId: bigint,
    moduleIds: string[],
  ) {
    const normalizedModuleIds =
      this.normalizeModuleIds(
        moduleIds,
      );

    if (
      normalizedModuleIds.length ===
      0
    ) {
      return {
        count: 0,
      };
    }

    return this.prisma.subscriptionPlanModule.createMany({
      data:
        normalizedModuleIds.map(
          (
            moduleId,
          ) => ({
            subscriptionPlanId,
            moduleId,
          }),
        ),

      skipDuplicates:
        true,
    });
  }


  async deleteByPlanId(
    subscriptionPlanId: bigint,
  ) {
    return this.prisma.subscriptionPlanModule.deleteMany({
      where: {
        subscriptionPlanId,
      },
    });
  }


  async findByPlanId(
    subscriptionPlanId: bigint,
  ) {
    return this.prisma.subscriptionPlanModule.findMany({
      where: {
        subscriptionPlanId,

        /*
         * Existing inactive module mapping
         * ko details me visible rehne dete hain.
         *
         * Deleted module expose nahi hoga.
         *
         * New assignment ke liye ACTIVE check
         * ModuleRepository.findByIds() me hota hai.
         */
        module: {
          deletedAt:
            null,
        },
      },

      select: {
        id:
          true,

        createdAt:
          true,

        module: {
          select: {
            id:
              true,

            uuid:
              true,

            name:
              true,

            code:
              true,

            icon:
              true,

            route:
              true,

            sortOrder:
              true,

            isMenu:
              true,

            isVisible:
              true,

            isSystem:
              true,

            status:
              true,
          },
        },
      },

      orderBy: {
        module: {
          sortOrder:
            "asc",
        },
      },
    });
  }


  async replaceModules(
    subscriptionPlanId: bigint,
    moduleIds: string[],
  ) {
    const normalizedModuleIds =
      this.normalizeModuleIds(
        moduleIds,
      );

    return this.prisma.$transaction(
      async (
        transaction,
      ) => {
        await transaction.subscriptionPlanModule.deleteMany({
          where: {
            subscriptionPlanId,
          },
        });

        /*
         * [] means intentionally
         * remove all modules.
         */
        if (
          normalizedModuleIds.length ===
          0
        ) {
          return {
            count: 0,
          };
        }

        return transaction.subscriptionPlanModule.createMany({
          data:
            normalizedModuleIds.map(
              (
                moduleId,
              ) => ({
                subscriptionPlanId,
                moduleId,
              }),
            ),

          skipDuplicates:
            true,
        });
      },
    );
  }
}