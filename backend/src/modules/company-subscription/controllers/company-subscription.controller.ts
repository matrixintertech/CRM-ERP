import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CompanySubscriptionService } from '../services/company-subscription.service';

import { CreateCompanySubscriptionDto } from '../dto/create-company-subscription.dto';

@ApiTags('Company Subscription')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('company-subscriptions')
export class CompanySubscriptionController {
  constructor(
    private readonly companySubscriptionService: CompanySubscriptionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Assign Subscription To Company',
  })
  create(
    @Body()
    dto: CreateCompanySubscriptionDto,
  ) {
    return this.companySubscriptionService.create(
      dto,
    );
  }
}