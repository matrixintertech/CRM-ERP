import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import {
  PermissionService,
} from "../services/permission.service";

import {
  CreatePermissionDto,
} from "../dto/create-permission.dto";

import {
  GetPermissionsQueryDto,
} from "../dto/get-permissions-query.dto";

import {
  GetGroupedPermissionsQueryDto,
} from "../dto/get-grouped-permissions-query.dto";

import {
  UpdatePermissionDto,
} from "../dto/update-permission.dto";

@Controller("permissions")
export class PermissionController {
  constructor(
    private readonly permissionService:
      PermissionService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreatePermissionDto,
  ) {
    return this.permissionService.create(
      dto,
    );
  }

  @Get()
  findAll(
    @Query()
    query: GetPermissionsQueryDto,
  ) {
    return this.permissionService.findAll(
      query,
    );
  }

  /*
   * Static route ko :uuid se pehle rakho.
   */
  @Get("grouped")
  findGrouped(
    @Query()
    query: GetGroupedPermissionsQueryDto,
  ) {
    return this.permissionService.findGrouped(
      query.type,
    );
  }

  @Get(":uuid")
  findOne(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,
  ) {
    return this.permissionService.findOne(
      uuid,
    );
  }

  @Patch(":uuid")
  update(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,

    @Body()
    dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  remove(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,
  ) {
    return this.permissionService.remove(
      uuid,
    );
  }
}