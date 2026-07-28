import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { PermissionService } from "../services/permission.service";

import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";

@Controller("permissions")
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreatePermissionDto,
  ) {
    return this.permissionService.create(dto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

   @Get("grouped")
findGrouped() {
  return this.permissionService.findGrouped();
}

  @Get(":id")
  findOne(
    @Param("id")
    id: string,
  ) {
    return this.permissionService.findOne(
      BigInt(id),
    );
  }

  @Patch(":id")
  update(
    @Param("id")
    id: string,

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
    @Param("id")
    id: string,
  ) {
    return this.permissionService.remove(
      BigInt(id),
    );
  }


}