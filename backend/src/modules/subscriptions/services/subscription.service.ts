import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SubscriptionRepository } from '../repositories/subscription.repository';

import { AssignPlanModulesDto } from '../dto/assign-plan-modules.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async findOne(
    id: number,
  ) {
    // Ye baad me actual repository se implement hoga.
    // Abhi placeholder hai.
    return {
      id,
    };
  }

  async findPlanModules(
    id: number,
  ) {
    await this.findOne(id);

    const modules =
      await this.subscriptionRepository.findPlanModules(
        BigInt(id),
      );

    return {
      subscriptionPlanId:
        id.toString(),

      moduleIds:
        modules.map((item) =>
          item.moduleId.toString(),
        ),
    };
  }

async assignPlanModules(
  id: number,
  dto: AssignPlanModulesDto,
) {
  try {
    console.log("Plan Id:", id);
    console.log("Module Ids:", dto.moduleIds);

    const result =
      await this.subscriptionRepository.assignPlanModules(
        BigInt(id),
        dto.moduleIds.map((id) => BigInt(id)),
      );

    console.log(result);

    return {
      message: "Modules assigned successfully.",
    };
  } catch (error: any) {
    console.error("========== ERROR ==========");
    console.dir(error, { depth: null });
    console.error(error?.stack);

    throw error;
  }
}
}