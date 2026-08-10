import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
   * Is route ko @Get(":uuid") se pehle rakho.
   * Warna "grouped" ko uuid treat kiya ja sakta hai.
   */
  @Get("grouped")
  findGrouped() {
    return this.permissionService.findGrouped();
  }

  @Get(":uuid")
  findOne(
    @Param("uuid")
    uuid: string,
  ) {
    return this.permissionService.findOne(
      uuid,
    );
  }

  @Patch(":uuid")
  update(
    @Param("uuid")
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
    @Param("uuid")
    uuid: string,
  ) {
    return this.permissionService.remove(
      uuid,
    );
  }
}