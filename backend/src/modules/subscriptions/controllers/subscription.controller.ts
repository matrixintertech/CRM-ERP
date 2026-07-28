import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SubscriptionService } from '../services/subscription.service';

import { AssignPlanModulesDto } from '../dto/assign-plan-modules.dto';

@ApiTags('Subscription Plans')
@ApiBearerAuth()
@Controller('subscription-plans')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // Existing CRUD methods...

  @Get(':id/modules')
  @ApiOperation({
    summary: 'Get Subscription Plan Modules',
  })
  @ApiResponse({
    status: 200,
    description:
      'Subscription plan modules fetched successfully.',
  })
  findPlanModules(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.subscriptionService.findPlanModules(
      id,
    );
  }

  @Put(':id/modules')
  @ApiOperation({
    summary:
      'Assign Modules To Subscription Plan',
  })
  @ApiResponse({
    status: 200,
    description:
      'Modules assigned successfully.',
  })
  assignPlanModules(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: AssignPlanModulesDto,
  ) {
    return this.subscriptionService.assignPlanModules(
      id,
      dto,
    );
  }
}