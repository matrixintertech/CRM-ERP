import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  PermissionType,
} from "@prisma/client";

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
  PermissionService,
} from "../services/permission.service";


@ApiTags("Company Permissions")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller("company/permissions")
export class CompanyPermissionController {
  constructor(
    private readonly permissionService:
      PermissionService,
  ) {}


  /*
   * Company permission catalog.
   *
   * Company Role/User assignment
   * screens ke liye read-only endpoint.
   *
   * Important:
   * Permission type frontend se accept
   * nahi karte.
   *
   * Backend always COMPANY force karega
   * so PLATFORM permissions company
   * boundary me expose nahi hongi.
   */
  @Get("grouped")
  @RequirePermission(
    "company.permission.view",
  )
  @ApiOperation({
    summary:
      "Get Company Permission Catalog",
  })
  findGrouped() {
    return this.permissionService.findGrouped(
      PermissionType.COMPANY,
    );
  }
}