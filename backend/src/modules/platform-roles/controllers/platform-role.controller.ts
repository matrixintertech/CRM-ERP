import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import {
  Status,
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
  PlatformRoleService,
} from "../services/platform-role.service";

import {
  CreatePlatformRoleDto,
} from "../dto/create-platform-role.dto";

import {
  UpdatePlatformRoleDto,
} from "../dto/update-platform-role.dto";

import {
  AssignPlatformRolePermissionsDto,
} from "../dto/assign-platform-role-permissions.dto";


@ApiTags(
  "Platform Roles",
)
@ApiBearerAuth(
  "access-token",
)
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller(
  "platform/roles",
)
export class PlatformRoleController {
  constructor(
    private readonly platformRoleService:
      PlatformRoleService,
  ) {}


  /*
   * Create platform role.
   */
  @Post()
  @RequirePermission(
    "platform.platform_role.create",
  )
  @ApiOperation({
    summary:
      "Create Platform Role",
  })
  create(
    @Body()
    dto:
      CreatePlatformRoleDto,
  ) {
    return this.platformRoleService.create(
      dto,
    );
  }


  /*
   * Get all platform roles.
   */
  @Get()
  @RequirePermission(
    "platform.platform_role.view",
  )
  @ApiOperation({
    summary:
      "Get Platform Roles",
  })
  @ApiQuery({
    name:
      "status",

    required:
      false,

    enum:
      Status,
  })
  @ApiQuery({
    name:
      "search",

    required:
      false,

    type:
      String,
  })
  findAll(
    @Query(
      "status",
    )
    status?:
      Status,

    @Query(
      "search",
    )
    search?:
      string,
  ) {
    return this.platformRoleService.findAll({
      status,

      search,
    });
  }


  /*
   * Active platform roles dropdown.
   *
   * Platform user create/update form
   * ke liye use hoga.
   *
   * Static route ko :uuid se pehle rakho.
   */
  @Get(
    "dropdown",
  )
  @RequirePermission(
    "platform.platform_role.view",
  )
  @ApiOperation({
    summary:
      "Get Platform Role Dropdown",
  })
  findDropdown() {
    return this.platformRoleService.findDropdown();
  }


  /*
   * Get permissions assigned
   * to a platform role.
   */
  @Get(
    ":uuid/permissions",
  )
  @RequirePermission(
    "platform.platform_role.view",
  )
  @ApiOperation({
    summary:
      "Get Platform Role Permissions",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  findPermissions(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    return this.platformRoleService.findPermissions(
      uuid,
    );
  }


  /*
   * Replace permissions assigned
   * to platform role.
   */
  @Put(
    ":uuid/permissions",
  )
  @RequirePermission(
    "platform.platform_role.update",
  )
  @ApiOperation({
    summary:
      "Assign Permissions To Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  assignPermissions(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,

    @Body()
    dto:
      AssignPlatformRolePermissionsDto,
  ) {
    return this.platformRoleService.assignPermissions(
      uuid,
      dto,
    );
  }


  /*
   * Get one platform role.
   */
  @Get(
    ":uuid",
  )
  @RequirePermission(
    "platform.platform_role.view",
  )
  @ApiOperation({
    summary:
      "Get Platform Role By UUID",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  findByUuid(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    return this.platformRoleService.findByUuid(
      uuid,
    );
  }


  /*
   * Update platform role.
   */
  @Patch(
    ":uuid",
  )
  @RequirePermission(
    "platform.platform_role.update",
  )
  @ApiOperation({
    summary:
      "Update Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  update(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,

    @Body()
    dto:
      UpdatePlatformRoleDto,
  ) {
    return this.platformRoleService.update(
      uuid,
      dto,
    );
  }


  /*
   * Soft delete platform role.
   */
  @Delete(
    ":uuid",
  )
  @RequirePermission(
    "platform.platform_role.delete",
  )
  @ApiOperation({
    summary:
      "Delete Platform Role",
  })
  @ApiParam({
    name:
      "uuid",

    type:
      String,
  })
  remove(
    @Param(
      "uuid",
      ParseUUIDPipe,
    )
    uuid:
      string,
  ) {
    return this.platformRoleService.remove(
      uuid,
    );
  }
}