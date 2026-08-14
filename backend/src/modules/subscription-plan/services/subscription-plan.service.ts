import {
  Prisma,
} from "@prisma/client";

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  SubscriptionPlanRepository,
} from "../repositories/subscription-plan.repository";

import {
  SubscriptionPlanModuleRepository,
} from "../repositories/subscription-plan-module.repository";

import {
  ModuleRepository,
} from "../../module/repositories/module.repository";

import {
  CreateSubscriptionPlanDto,
} from "../dto/create-subscription-plan.dto";

import {
  GetSubscriptionPlansDto,
} from "../dto/get-subscription-plans.dto";

import {
  UpdateSubscriptionPlanDto,
} from "../dto/update-subscription-plan.dto";


@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly subscriptionPlanRepository:
      SubscriptionPlanRepository,

    private readonly subscriptionPlanModuleRepository:
      SubscriptionPlanModuleRepository,

    private readonly moduleRepository:
      ModuleRepository,
  ) {}


  /*
   * Validate requested module IDs.
   *
   * Subscription plan me sirf existing
   * modules assign hone chahiye.
   */
  private async validateModuleIds(
    moduleIds: string[],
  ): Promise<string[]> {
    const uniqueModuleIds =
      [...new Set(moduleIds)];

    if (
      uniqueModuleIds.length === 0
    ) {
      return [];
    }

    const modules =
      await this.moduleRepository.findByIds(
        uniqueModuleIds,
      );

    if (
      modules.length !==
      uniqueModuleIds.length
    ) {
      throw new NotFoundException(
        "One or more modules were not found.",
      );
    }

    return uniqueModuleIds;
  }


  /**
   * Create subscription plan
   */
  async create(
    dto: CreateSubscriptionPlanDto,
  ) {
    try {
      const {
        moduleIds = [],
        ...rawPlanData
      } = dto;

      const code =
        rawPlanData.code
          .trim()
          .toUpperCase();

      const name =
        rawPlanData.name.trim();

      const existingPlan =
        await this.subscriptionPlanRepository.findByCode(
          code,
        );

      if (existingPlan) {
        throw new ConflictException(
          "Subscription plan code already exists.",
        );
      }

      const validatedModuleIds =
        await this.validateModuleIds(
          moduleIds,
        );

      const subscriptionPlan =
        await this.subscriptionPlanRepository.create({
          ...rawPlanData,

          name,
          code,

          description:
            rawPlanData.description
              ?.trim(),
        });

      if (
        validatedModuleIds.length >
        0
      ) {
        await this.subscriptionPlanModuleRepository.createMany(
          subscriptionPlan.id,
          validatedModuleIds,
        );
      }

      return {
        message:
          "Subscription plan created successfully.",

        subscriptionPlan,
      };
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code ===
          "P2002"
      ) {
        throw new ConflictException(
          "Subscription plan code already exists.",
        );
      }

      throw error;
    }
  }


  /**
   * List subscription plans
   */
  async findAll(
    dto: GetSubscriptionPlansDto,
  ) {
    const skip =
      (dto.page - 1) *
      dto.limit;

    const [
      subscriptionPlans,
      total,
    ] = await Promise.all([
      this.subscriptionPlanRepository.findAll(
        skip,
        dto.limit,
        dto.search,
      ),

      this.subscriptionPlanRepository.count(
        dto.search,
      ),
    ]);

    return {
      subscriptionPlans,

      pagination: {
        total,

        page:
          dto.page,

        limit:
          dto.limit,

        totalPages:
          Math.ceil(
            total /
              dto.limit,
          ),
      },
    };
  }


  /**
   * Find subscription plan
   * by internal ID.
   */
  async findById(
    id: bigint,
  ) {
    const subscriptionPlan =
      await this.subscriptionPlanRepository.findById(
        id,
      );

    if (
      !subscriptionPlan
    ) {
      throw new NotFoundException(
        "Subscription plan not found.",
      );
    }

    const selectedModules =
      await this.subscriptionPlanModuleRepository.findByPlanId(
        id,
      );

    return {
      subscriptionPlan: {
        ...subscriptionPlan,

        moduleIds:
          selectedModules.map(
            (
              item,
            ) =>
              item.module.id.toString(),
          ),

        modules:
          selectedModules.map(
            (
              item,
            ) => ({
              id:
                item.module.id.toString(),

              uuid:
                item.module.uuid,

              name:
                item.module.name,

              code:
                item.module.code,

              icon:
                item.module.icon,

              route:
                item.module.route,

              sortOrder:
                item.module.sortOrder,

              status:
                item.module.status,
            }),
          ),
      },
    };
  }


  /**
   * Update subscription plan
   */
  async update(
    id: bigint,
    dto: UpdateSubscriptionPlanDto,
  ) {
    try {
      const subscriptionPlan =
        await this.subscriptionPlanRepository.findById(
          id,
        );

      if (
        !subscriptionPlan
      ) {
        throw new NotFoundException(
          "Subscription plan not found.",
        );
      }

      const {
        moduleIds,
        ...rawPlanData
      } = dto;

      const code =
        rawPlanData.code
          ? rawPlanData.code
              .trim()
              .toUpperCase()
          : undefined;

      const name =
        rawPlanData.name
          ? rawPlanData.name.trim()
          : undefined;

      if (
        code &&
        code !==
          subscriptionPlan.code
      ) {
        const existingPlan =
          await this.subscriptionPlanRepository.findByCodeExceptId(
            code,
            id,
          );

        if (
          existingPlan
        ) {
          throw new ConflictException(
            "Subscription plan code already exists.",
          );
        }
      }

      let validatedModuleIds:
        string[] | undefined;

      /*
       * undefined
       * → existing mappings untouched
       *
       * []
       * → remove all mappings
       *
       * [...]
       * → replace mappings
       */
      if (
        moduleIds !==
        undefined
      ) {
        validatedModuleIds =
          await this.validateModuleIds(
            moduleIds,
          );
      }

      const updatedPlan =
        await this.subscriptionPlanRepository.update(
          id,
          {
            ...rawPlanData,

            name,
            code,

            description:
              rawPlanData.description !==
              undefined
                ? rawPlanData.description
                    ?.trim()
                : undefined,
          },
        );

      if (
        validatedModuleIds !==
        undefined
      ) {
        await this.subscriptionPlanModuleRepository.replaceModules(
          id,
          validatedModuleIds,
        );
      }

      return {
        message:
          "Subscription plan updated successfully.",

        subscriptionPlan:
          updatedPlan,
      };
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code ===
          "P2002"
      ) {
        throw new ConflictException(
          "Subscription plan code already exists.",
        );
      }

      throw error;
    }
  }


  /**
   * Soft delete subscription plan
   */
  async delete(
    id: bigint,
  ) {
    const subscriptionPlan =
      await this.subscriptionPlanRepository.findById(
        id,
      );

    if (
      !subscriptionPlan
    ) {
      throw new NotFoundException(
        "Subscription plan not found.",
      );
    }

    await this.subscriptionPlanModuleRepository.deleteByPlanId(
      id,
    );

    await this.subscriptionPlanRepository.softDelete(
      id,
    );

    return {
      message:
        "Subscription plan deleted successfully.",
    };
  }
}