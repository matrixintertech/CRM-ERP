import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { PermissionService } from "../services/permission.service";

import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";

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
  findAll() {
    return this.permissionService.findAll();
  }

  /*
   * Is route ko @Get(":id") se pehle hi rakho.
   * Warna "grouped" ko id treat kiya ja sakta hai.
   */
  @Get("grouped")
  findGrouped() {
    return this.permissionService.findGrouped();
  }

  @Get(":id")
  findOne(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.permissionService.findOne(
      BigInt(id),
    );
  }

  @Patch(":id")
  update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(
      BigInt(id),
      dto,
    );
  }

  @Delete(":id")
  remove(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.permissionService.remove(
      BigInt(id),
    );
  }
}