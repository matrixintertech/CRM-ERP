import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
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
  CompanyService,
} from "../services/company.service";

import {
  UpdateCompanyProfileDto,
} from "../dto/update-company-profile.dto";


@ApiTags("Company Profile")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller("companies")
export class CompanyController {
  constructor(
    private readonly companyService:
      CompanyService,
  ) {}


  /*
   * Logged-in tenant/company ka
   * own company profile.
   *
   * PLATFORM users ke liye nahi.
   */
  @Get("profile")
  @RequirePermission(
    "company.company_profile.view",
  )
  @ApiOperation({
    summary:
      "Get logged-in company profile",
  })
  async getProfile(
    @Req()
    req: Request,
  ) {
    const user =
      (req as any).user;


    return this.companyService.getProfile(
      BigInt(
        user.companyId,
      ),
    );
  }


  /*
   * Logged-in tenant/company ka
   * own profile update.
   */
  @Patch("profile")
  @RequirePermission(
    "company.company_profile.update",
  )
  @ApiOperation({
    summary:
      "Update logged-in company profile",
  })
  async updateProfile(
    @Req()
    req: Request,

    @Body()
    dto:
      UpdateCompanyProfileDto,
  ) {
    const user =
      (req as any).user;


    return this.companyService.updateProfile(
      BigInt(
        user.companyId,
      ),
      dto,
    );
  }
}