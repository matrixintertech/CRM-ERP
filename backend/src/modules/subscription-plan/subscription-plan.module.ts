import {
  Module,
} from "@nestjs/common";

import {
  PrismaModule,
} from "src/database/prisma.module";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  ModuleModule,
} from "../module/module.module";

import {
  SubscriptionPlanController,
} from "./controllers/subscription-plan.controller";

import {
  SubscriptionPlanService,
} from "./services/subscription-plan.service";

import {
  SubscriptionPlanRepository,
} from "./repositories/subscription-plan.repository";

import {
  SubscriptionPlanModuleRepository,
} from "./repositories/subscription-plan-module.repository";


@Module({
  imports: [
    PrismaModule,
    AuthorizationModule,
    ModuleModule,
  ],

  controllers: [
    SubscriptionPlanController,
  ],

  providers: [
    SubscriptionPlanService,
    SubscriptionPlanRepository,
    SubscriptionPlanModuleRepository,
  ],

  exports: [
    SubscriptionPlanService,
    SubscriptionPlanRepository,
    SubscriptionPlanModuleRepository,
  ],
})
export class SubscriptionPlanModule {}