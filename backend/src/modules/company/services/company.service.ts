import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

import {
  CompanyRepository,
} from "../repositories/company.repository";

import {
  CompanyAuthorizationBootstrapService,
} from "../../authorization/services/company-authorization-bootstrap.service";

import {
  CreateCompanyDto,
} from "../dto/create-company.dto";

import {
  GetCompaniesDto,
} from "../dto/get-companies.dto";

import {
  UpdateCompanyDto,
} from "../dto/update-company.dto";

import {
  UpdateCompanyProfileDto,
} from "../dto/update-company-profile.dto";


@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyRepository:
      CompanyRepository,

    private readonly companyAuthorizationBootstrapService:
      CompanyAuthorizationBootstrapService,
  ) {}


  async create(
    dto: CreateCompanyDto,
    tx?: Prisma.TransactionClient,
  ) {
    /*
     * -------------------------------------------------------
     * 1. Company Code
     * -------------------------------------------------------
     */
    const companyCode =
      await this.companyRepository.findByCode(
        dto.code,
      );

    if (companyCode) {
      throw new ConflictException(
        "Company code already exists.",
      );
    }


    /*
     * -------------------------------------------------------
     * 2. Email
     * -------------------------------------------------------
     */
    if (dto.email) {
      const companyEmail =
        await this.companyRepository.findByEmail(
          dto.email,
        );

      if (companyEmail) {
        throw new ConflictException(
          "Company email already exists.",
        );
      }
    }


    /*
     * -------------------------------------------------------
     * 3. Mobile
     * -------------------------------------------------------
     */
    if (dto.mobile) {
      const companyMobile =
        await this.companyRepository.findByMobile(
          dto.mobile,
        );

      if (companyMobile) {
        throw new ConflictException(
          "Company mobile already exists.",
        );
      }
    }


    /*
     * -------------------------------------------------------
     * 4. Company + Company Admin authorization bootstrap
     * -------------------------------------------------------
     */
    const createCompanyWithAuthorization =
      async (
        transaction:
          Prisma.TransactionClient,
      ) => {
        /*
         * Create company.
         */
        const company =
          await this.companyRepository.create(
            {
              name:
                dto.name,

              code:
                dto.code,

              email:
                dto.email,

              mobile:
                dto.mobile,

              logo:
                dto.logo,
            },
            transaction,
          );


        /*
         * Immediately create/ensure:
         *
         * COMPANY_ADMIN system role
         * isSystem = true
         * status   = ACTIVE
         *
         * + complete default Company Admin
         * RolePermission template.
         *
         * Iske baad manual seed ki
         * zarurat nahi honi chahiye.
         */
        await this.companyAuthorizationBootstrapService
          .bootstrapCompanyAdminRole(
            transaction,
            company.id,
          );


        return company;
      };


    /*
     * Agar caller already transaction
     * provide kar raha hai, same transaction
     * use karenge.
     *
     * Nested transaction start nahi karenge.
     */
    if (tx) {
      return createCompanyWithAuthorization(
        tx,
      );
    }


    /*
     * Normal company creation:
     *
     * Company
     * + COMPANY_ADMIN role
     * + default permissions
     *
     * all-or-nothing transaction.
     */
    return this.prisma.$transaction(
      async (
        transaction,
      ) =>
        createCompanyWithAuthorization(
          transaction,
        ),
    );
  }


  /*
   * =========================================================
   * GET ALL COMPANIES
   * =========================================================
   */
  async findAll(
    dto: GetCompaniesDto,
  ) {
    const skip =
      (dto.page - 1) *
      dto.limit;


    const companies =
      await this.companyRepository.findAll(
        skip,
        dto.limit,
        dto.search,
      );


    const total =
      await this.companyRepository.count(
        dto.search,
      );


    return {
      companies,

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


  /*
   * =========================================================
   * GET COMPANY
   * =========================================================
   */
  async findById(
    id: bigint,
  ) {
    const company =
      await this.companyRepository.findById(
        id,
      );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    return {
      company,
    };
  }


  /*
   * =========================================================
   * UPDATE COMPANY
   * =========================================================
   */
  async update(
    id: bigint,
    dto: UpdateCompanyDto,
  ) {
    /*
     * 1. Company exists?
     */
    const company =
      await this.companyRepository.findById(
        id,
      );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    /*
     * 2. Company Code
     */
    if (dto.code) {
      const companyCode =
        await this.companyRepository
          .findByCodeExceptId(
            dto.code,
            id,
          );


      if (companyCode) {
        throw new ConflictException(
          "Company code already exists.",
        );
      }
    }


    /*
     * 3. Email
     */
    if (dto.email) {
      const companyEmail =
        await this.companyRepository
          .findByEmailExceptId(
            dto.email,
            id,
          );


      if (companyEmail) {
        throw new ConflictException(
          "Company email already exists.",
        );
      }
    }


    /*
     * 4. Mobile
     */
    if (dto.mobile) {
      const companyMobile =
        await this.companyRepository
          .findByMobileExceptId(
            dto.mobile,
            id,
          );


      if (companyMobile) {
        throw new ConflictException(
          "Company mobile already exists.",
        );
      }
    }


    /*
     * 5. Update
     */
    const updatedCompany =
      await this.companyRepository.update(
        id,
        {
          name:
            dto.name,

          code:
            dto.code,

          email:
            dto.email,

          mobile:
            dto.mobile,

          logo:
            dto.logo,
        },
      );


    return {
      message:
        "Company updated successfully.",

      company:
        updatedCompany,
    };
  }


  /*
   * =========================================================
   * DELETE COMPANY
   * =========================================================
   */
  async delete(
    id: bigint,
  ) {
    const company =
      await this.companyRepository.findById(
        id,
      );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    await this.companyRepository.softDelete(
      id,
    );


    return {
      message:
        "Company deleted successfully.",
    };
  }


  /*
   * =========================================================
   * COMPANY PROFILE
   * =========================================================
   */
  async getProfile(
    companyId: bigint,
  ) {
    const company =
      await this.companyRepository.findProfile(
        companyId,
      );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    return company;
  }


  async updateProfile(
    companyId: bigint,
    dto: UpdateCompanyProfileDto,
  ) {
    const company =
      await this.companyRepository.findProfile(
        companyId,
      );


    if (!company) {
      throw new NotFoundException(
        "Company not found.",
      );
    }


    return this.companyRepository.updateProfile(
      companyId,
      dto,
    );
  }
}