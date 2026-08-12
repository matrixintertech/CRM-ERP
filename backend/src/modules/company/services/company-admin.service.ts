import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UserStatus,
  UserType,
} from "@prisma/client";

import { CompanyRepository } from '../repositories/company.repository';
import { CompanySubscriptionRepository } from '../../company-subscription/repositories/company-subscription.repository';

import { UserService } from '../../user/services/user.service';

import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';

@Injectable()
export class CompanyAdminService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly companySubscriptionRepository: CompanySubscriptionRepository,
    private readonly userService: UserService,
  ) {}


async create(
  companyId: bigint,
  dto: CreateCompanyAdminDto,
) {
  // 1. Company Exists?
  const company =
    await this.companyRepository.findById(
      companyId,
    );

  if (!company) {
    throw new NotFoundException(
      'Company not found.',
    );
  }

  // 2. Active Subscription?
  const subscription =
    await this.companySubscriptionRepository.findActiveByCompanyId(
      companyId,
    );

  if (!subscription) {
    throw new ConflictException(
      'Company does not have an active subscription.',
    );
  }

  // 3. Company Admin Already Exists?
  const companyAdmin =
    await this.userService.findCompanyAdmin(
      companyId,
    );

  if (companyAdmin) {
    throw new ConflictException(
      'Company admin already exists.',
    );
  }

 const user =
  await this.userService.create(
    {
      displayName:
        dto.displayName,

      email:
        dto.email,

      mobile:
        dto.mobile,
    },
    {
      companyId,

      userType:
        UserType.COMPANY_ADMIN,

      status:
        UserStatus.ACTIVE,
    },
  );

return {
  message:
    'Company admin created successfully.',

  user,
};

}


}