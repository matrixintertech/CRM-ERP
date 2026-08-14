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


@ApiTags("Platform Permissions")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard
 
)
@Controller("platform/permissions")
export class PermissionController {
  constructor(
    private readonly permissionService:
      PermissionService,
  ) {}


  /*
   * Create permission definition.
   */
  @Post()
  @RequirePermission(
    "platform.permission.create",
  )
  @ApiOperation({
    summary:
      "Create Permission",
  })
  create(
    @Body()
    dto:
      CreatePermissionDto,
  ) {
    return this.permissionService.create(
      dto,
    );
  }


  /*
   * Get permission definitions.
   *
   * Platform permission administrator
   * COMPANY + PLATFORM definitions
   * dono inspect kar sakta hai.
   */
  @Get()
  @RequirePermission(
    "platform.permission.view",
  )
  @ApiOperation({
    summary:
      "Get Permissions",
  })
  findAll(
    @Query()
    query:
      GetPermissionsQueryDto,
  ) {
    return this.permissionService.findAll(
      query,
    );
  }


  /*
   * Grouped permission definitions.
   *
   * Static route ko :uuid se
   * pehle rakho.
   */
  @Get("grouped")
  // @RequirePermission(
  //   "platform.permission.view",
  // )
  @ApiOperation({
    summary:
      "Get Grouped Permissions",
  })
  findGrouped(
    @Query()
    query:
      GetGroupedPermissionsQueryDto,
  ) {
    return this.permissionService.findGrouped(
      query.type,
    );
  }


  /*
   * Get one permission.
   */
  @Get(":uuid")
  @RequirePermission(
    "platform.permission.view",
  )
  @ApiOperation({
    summary:
      "Get Permission By UUID",
  })
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


  /*
   * Update permission definition.
   */
  @Patch(":uuid")
  @RequirePermission(
    "platform.permission.update",
  )
  @ApiOperation({
    summary:
      "Update Permission",
  })
  update(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid: string,

    @Body()
    dto:
      UpdatePermissionDto,
  ) {
    return this.permissionService.update(
      uuid,
      dto,
    );
  }


  /*
   * Soft delete permission definition.
   */
  @Delete(":uuid")
  @RequirePermission(
    "platform.permission.delete",
  )
  @ApiOperation({
    summary:
      "Delete Permission",
  })
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