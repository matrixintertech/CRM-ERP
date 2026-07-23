import {
  Body,
  Controller,
  Post,
  UseGuards,
   Get,
   Patch,
  Query,
  Param,
  Delete
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';


import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { SubscriptionPlanService } from '../services/subscription-plan.service';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { GetSubscriptionPlansDto } from '../dto/get-subscription-plans.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';


@ApiTags('Subscription Plan')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Subscription Plan',
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
@ApiOperation({
  summary: 'Subscription Plan List',
})
findAll(
  @Query()
  dto: GetSubscriptionPlansDto,
) {
  return this.subscriptionPlanService.findAll(
    dto,
  );
}

@Get(':id')
@ApiOperation({
  summary: 'Get Subscription Plan Details',
})
findById(
  @Param('id')
  id: string,
) {
  return this.subscriptionPlanService.findById(
    BigInt(id),
  );
}


@Patch(':id')
@ApiOperation({
  summary: 'Update Subscription Plan',
})
update(
  @Param('id')
  id: string,

  @Body()
  dto: UpdateSubscriptionPlanDto,
) {
  return this.subscriptionPlanService.update(
    BigInt(id),
    dto,
  );
}


@Delete(':id')
@ApiOperation({
  summary: 'Delete Subscription Plan',
})
delete(
  @Param('id')
  id: string,
) {
  return this.subscriptionPlanService.delete(
    BigInt(id),
  );
}



}