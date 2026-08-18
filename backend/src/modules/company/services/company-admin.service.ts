import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

import {
  CompanyRepository,
} from "../repositories/company.repository";

import {
  CompanySubscriptionRepository,
} from "../../company-subscription/repositories/company-subscription.repository";

import {
  UserService,
} from "../../user/services/user.service";

import {
  CompanyAuthorizationBootstrapService,
} from "../../authorization/services/company-authorization-bootstrap.service";

import {
  CreateCompanyAdminDto,
} from "../dto/create-company-admin.dto";


@Injectable()
export class CompanyAdminService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyRepository:
      CompanyRepository,

    private readonly companySubscriptionRepository:
      CompanySubscriptionRepository,

    private readonly userService:
      UserService,

    private readonly companyAuthorizationBootstrapService:
      CompanyAuthorizationBootstrapService,
  ) {}


  async create(
    companyId: bigint,
    dto: CreateCompanyAdminDto,
  ) {
    /*
     * -------------------------------------------------------
     * 1. Company exists?
     * -------------------------------------------------------
     */
    const company =
      await this.companyRepository.findById(
        companyId,
      );

    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    /*
     * -------------------------------------------------------
     * 2. Active subscription?
     * -------------------------------------------------------
     */
    const subscription =
      await this.companySubscriptionRepository
        .findActiveByCompanyId(
          companyId,
        );

    if (!subscription) {
      throw new ConflictException(
        "Company does not have an active subscription.",
      );
    }


    /*
     * -------------------------------------------------------
     * 3. Company Admin already exists?
     * -------------------------------------------------------
     */
    const existingCompanyAdmin =
      await this.userService.findCompanyAdmin(
        companyId,
      );

    if (existingCompanyAdmin) {
      throw new ConflictException(
        "Company admin already exists.",
      );
    }


    /*
     * -------------------------------------------------------
     * 4. Bootstrap role + create admin atomically
     * -------------------------------------------------------
     *
     * Important:
     *
     * COMPANY_ADMIN system role
     * + RolePermission grants
     * + Company Admin user
     *
     * same database transaction me create honge.
     *
     * Agar user creation fail hui to bootstrap changes
     * bhi rollback ho jayenge.
     */
    const user =
      await this.prisma.$transaction(
        async (tx) => {
          /*
           * Ensure per-company system role:
           *
           * code     = COMPANY_ADMIN
           * isSystem = true
           *
           * and default Company Admin template permissions.
           */
          const companyAdminRole =
            await this.companyAuthorizationBootstrapService
              .bootstrapCompanyAdminRole(
                tx,
                companyId,
              );


              console.log(
  "COMPANY_ADMIN_CREATE_DEBUG",
  {
    companyId:
      companyId.toString(),

    roleId:
      companyAdminRole.id.toString(),

    roleCode:
      companyAdminRole.code,
  },
);


          /*
           * Create actual admin account.
           *
           * UserType identifies account category/boundary.
           *
           * Authorization comes from:
           *
           * User.roleId
           *   -> Role
           *   -> RolePermission
           *   -> Permission
           */
   
        
          return this.userService.create(
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

              roleId:
                companyAdminRole.id,

              userType:
                UserType.COMPANY_ADMIN,

              status:
                UserStatus.ACTIVE,
            },
            tx,
          );
        },
      );


    return {
      message:
        "Company admin created successfully.",

      user,
    };
  }
}