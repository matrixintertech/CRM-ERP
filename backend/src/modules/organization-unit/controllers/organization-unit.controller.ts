import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import {
  AuthGuard,
} from "@nestjs/passport";

import type {
  Request,
} from "express";

import type {
  User,
} from "@prisma/client";

import {
  CreateOrganizationUnitDto,
} from "../dto/create-organization-unit.dto";

import {
  UpdateOrganizationUnitDto,
} from "../dto/update-organization-unit.dto";

import {
  OrganizationUnitService,
} from "../services/organization-unit.service";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

interface AuthenticatedRequest
  extends Request {
  user: User;
}

@ApiTags("Organization Unit")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("organization-units")
export class OrganizationUnitController {
  constructor(
    private readonly organizationUnitService:
      OrganizationUnitService,
  ) {}

  @Post()
  @RequirePermission(
    "company.organization_unit.create",
  )
  @ApiOperation({
    summary:
      "Create Organization Unit",
  })
  @ApiResponse({
    status: 201,
    description:
      "Organization unit created successfully.",
  })
  create(
    @Req()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateOrganizationUnitDto,
  ) {
    return this.organizationUnitService.create(
      req.user,
      dto,
    );
  }

  @Get()
  @RequirePermission(
    "company.organization_unit.view",
  )
  @ApiOperation({
    summary:
      "Get Organization Units",
  })
  @ApiResponse({
    status: 200,
    description:
      "Organization units fetched successfully.",
  })
  findAll(
    @Req()
    req: AuthenticatedRequest,
  ) {
    return this.organizationUnitService.findAll(
      req.user,
    );
  }

  @Get(":uuid")
  @RequirePermission(
    "company.organization_unit.view",
  )
  @ApiOperation({
    summary:
      "Get Organization Unit",
  })
  @ApiParam({
    name: "uuid",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Organization unit fetched successfully.",
  })
  findOne(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,
  ) {
    return this.organizationUnitService.findOne(
      req.user,
      uuid,
    );
  }

  @Patch(":uuid")
  @RequirePermission(
    "company.organization_unit.update",
  )
  @ApiOperation({
    summary:
      "Update Organization Unit",
  })
  @ApiParam({
    name: "uuid",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Organization unit updated successfully.",
  })
  update(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,

    @Body()
    dto: UpdateOrganizationUnitDto,
  ) {
    return this.organizationUnitService.update(
      req.user,
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @RequirePermission(
    "company.organization_unit.delete",
  )
  @ApiOperation({
    summary:
      "Delete Organization Unit",
  })
  @ApiParam({
    name: "uuid",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      "Organization unit deleted successfully.",
  })
  delete(
    @Req()
    req: AuthenticatedRequest,

    @Param("uuid")
    uuid: string,
  ) {
    return this.organizationUnitService.delete(
      req.user,
      uuid,
    );
  }
}