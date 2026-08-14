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
  CompanyService,
} from "../services/company.service";

import {
  CompanyAdminService,
} from "../services/company-admin.service";

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
  CreateCompanyAdminDto,
} from "../dto/create-company-admin.dto";


@ApiTags("Platform Companies")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller("platform/companies")
export class PlatformCompanyController {
  constructor(
    private readonly companyService:
      CompanyService,

    private readonly companyAdminService:
      CompanyAdminService,
  ) {}


  /*
   * Platform company list.
   */
  @Get()
  @RequirePermission(
    "platform.company.view",
  )
  @ApiOperation({
    summary:
      "Company List",
  })
  findAll(
    @Query()
    dto:
      GetCompaniesDto,
  ) {
    return this.companyService.findAll(
      dto,
    );
  }


  /*
   * Create tenant/company.
   */
  @Post()
  @RequirePermission(
    "platform.company.create",
  )
  @ApiOperation({
    summary:
      "Create Company",
  })
  create(
    @Body()
    dto:
      CreateCompanyDto,
  ) {
    return this.companyService.create(
      dto,
    );
  }


  /*
   * Platform-side company details.
   */
  @Get(":id")
  @RequirePermission(
    "platform.company.view",
  )
  @ApiOperation({
    summary:
      "Get Company Details",
  })
  findById(
    @Param("id")
    id: string,
  ) {
    return this.companyService.findById(
      BigInt(
        id,
      ),
    );
  }


  /*
   * Platform-side company update.
   */
  @Patch(":id")
  @RequirePermission(
    "platform.company.update",
  )
  @ApiOperation({
    summary:
      "Update Company",
  })
  update(
    @Param("id")
    id: string,

    @Body()
    dto:
      UpdateCompanyDto,
  ) {
    return this.companyService.update(
      BigInt(
        id,
      ),
      dto,
    );
  }


  /*
   * Platform-side company delete.
   */
  @Delete(":id")
  @RequirePermission(
    "platform.company.delete",
  )
  @ApiOperation({
    summary:
      "Delete Company",
  })
  delete(
    @Param("id")
    id: string,
  ) {
    return this.companyService.delete(
      BigInt(
        id,
      ),
    );
  }


  /*
   * Company ke andar initial/admin
   * account create karna platform
   * administration action hai.
   */
  @Post(":companyId/admin")
  @RequirePermission(
    "platform.company_admin.create",
  )
  @ApiOperation({
    summary:
      "Create Company Admin",
  })
  createCompanyAdmin(
    @Param("companyId")
    companyId: string,

    @Body()
    dto:
      CreateCompanyAdminDto,
  ) {
    return this.companyAdminService.create(
      BigInt(
        companyId,
      ),
      dto,
    );
  }
}