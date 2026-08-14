import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  JwtAuthGuard,
} from "../../auth/guards/jwt-auth.guard";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

import {
  SubscriptionPlanService,
} from "../services/subscription-plan.service";

import {
  CreateSubscriptionPlanDto,
} from "../dto/create-subscription-plan.dto";

import {
  GetSubscriptionPlansDto,
} from "../dto/get-subscription-plans.dto";

import {
  UpdateSubscriptionPlanDto,
} from "../dto/update-subscription-plan.dto";


@ApiTags("Platform Subscription Plans")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller("platform/subscription-plans")
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService:
      SubscriptionPlanService,
  ) {}


  @Post()
  @RequirePermission(
    "platform.subscription_plan.create",
  )
  @ApiOperation({
    summary:
      "Create Subscription Plan",
  })
  create(
    @Body()
    dto: CreateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlanService.create(
      dto,
    );
  }


  @Get()
  @RequirePermission(
    "platform.subscription_plan.view",
  )
  @ApiOperation({
    summary:
      "Subscription Plan List",
  })
  findAll(
    @Query()
    dto: GetSubscriptionPlansDto,
  ) {
    return this.subscriptionPlanService.findAll(
      dto,
    );
  }


  @Get(":id")
  @RequirePermission(
    "platform.subscription_plan.view",
  )
  @ApiOperation({
    summary:
      "Get Subscription Plan Details",
  })
  findById(
    @Param("id")
    id: string,
  ) {
    return this.subscriptionPlanService.findById(
      BigInt(id),
    );
  }


  @Patch(":id")
  @RequirePermission(
    "platform.subscription_plan.update",
  )
  @ApiOperation({
    summary:
      "Update Subscription Plan",
  })
  update(
    @Param("id")
    id: string,

    @Body()
    dto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlanService.update(
      BigInt(id),
      dto,
    );
  }


  @Delete(":id")
  @RequirePermission(
    "platform.subscription_plan.delete",
  )
  @ApiOperation({
    summary:
      "Delete Subscription Plan",
  })
  delete(
    @Param("id")
    id: string,
  ) {
    return this.subscriptionPlanService.delete(
      BigInt(id),
    );
  }
}