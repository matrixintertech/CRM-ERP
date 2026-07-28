import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { OnboardingService } from '../services/onboarding.service';
import { CreateOnboardingDto } from '../dto/create-onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
  ) {}

  @Post('company')
  create(
    @Body()
    dto: CreateOnboardingDto,
  ) {
    return this.onboardingService.create(
      dto,
    );
  }
}