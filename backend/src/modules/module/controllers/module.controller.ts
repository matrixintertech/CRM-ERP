import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
  ModuleService,
} from "../services/module.service";

import {
  CreateModuleDto,
} from "../dto/create-module.dto";

import {
  UpdateModuleDto,
} from "../dto/update-module.dto";


@ApiTags("Platform Modules")
@ApiBearerAuth("access-token")
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@Controller("platform/modules")
export class ModuleController {
  constructor(
    private readonly moduleService:
      ModuleService,
  ) {}


  @Post()
  @RequirePermission(
    "platform.module.create",
  )
  @ApiOperation({
    summary:
      "Create Platform Module",
  })
  @ApiResponse({
    status: 201,
    description:
      "Module created successfully.",
  })
  create(
    @Body()
    dto: CreateModuleDto,
  ) {
    return this.moduleService.create(
      dto,
    );
  }


  @Get()
  @RequirePermission(
    "platform.module.view",
  )
  @ApiOperation({
    summary:
      "Platform Module List",
  })
  @ApiResponse({
    status: 200,
    description:
      "Modules fetched successfully.",
  })
  findAll() {
    return this.moduleService.findAll();
  }


  @Get(":id")
  @RequirePermission(
    "platform.module.view",
  )
  @ApiOperation({
    summary:
      "Get Platform Module Details",
  })
  @ApiResponse({
    status: 200,
    description:
      "Module fetched successfully.",
  })
  findOne(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.moduleService.findOne(
      id,
    );
  }


  @Patch(":id")
  @RequirePermission(
    "platform.module.update",
  )
  @ApiOperation({
    summary:
      "Update Platform Module",
  })
  @ApiResponse({
    status: 200,
    description:
      "Module updated successfully.",
  })
  update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateModuleDto,
  ) {
    return this.moduleService.update(
      id,
      dto,
    );
  }


  @Delete(":id")
  @RequirePermission(
    "platform.module.delete",
  )
  @ApiOperation({
    summary:
      "Delete Platform Module",
  })
  @ApiResponse({
    status: 200,
    description:
      "Module deleted successfully.",
  })
  remove(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.moduleService.remove(
      id,
    );
  }
}