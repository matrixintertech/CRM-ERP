import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { UserType } from '@prisma/client';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import { CreateRoleDto } from '../dto/create-role.dto';

import { UpdateRoleDto } from '../dto/update-role.dto';

import { AssignRolePermissionsDto } from '../dto/assign-role-permissions.dto';

import { RoleService } from '../services/role.service';

@ApiTags('Role')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Role',
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully.',
  })
  create(
    @Req() req: Request,
    @Body()
    dto: CreateRoleDto,
  ) {
    return this.roleService.create(BigInt((req.user as any).companyId), dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Roles',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles fetched successfully.',
  })
  findAll(@Req() req: Request) {
    const user = req.user as any;

    if (user.userType === UserType.PLATFORM_OWNER) {
      return this.roleService.findAll();
    }

    return this.roleService.findAll(BigInt(user.companyId));
  }

  /*
   * Static route ko :uuid route se pehle rakho.
   */
  @Get('dropdown')
  @ApiOperation({
    summary: 'Get Active Role Dropdown',
  })
  @ApiResponse({
    status: 200,
    description: 'Role dropdown fetched successfully.',
  })
  findDropdown(@Req() req: Request) {
    return this.roleService.findDropdown(BigInt((req.user as any).companyId));
  }

  /*
   * Permission routes ko general :uuid route se
   * pehle rakhna safer hai.
   */
  @Get(':uuid/permissions')
  @ApiOperation({
    summary: 'Get Role Permissions',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role permissions fetched successfully.',
  })
  findRolePermissions(
    @Req() req: Request,
    @Param('uuid')
    uuid: string,
  ) {
    return this.roleService.findRolePermissions(
      BigInt((req.user as any).companyId),
      uuid,
    );
  }

  @Put(':uuid/permissions')
  @ApiOperation({
    summary: 'Assign Role Permissions',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned successfully.',
  })
  assignPermissions(
    @Req() req: Request,
    @Param('uuid')
    uuid: string,
    @Body()
    dto: AssignRolePermissionsDto,
  ) {
    return this.roleService.assignPermissions(
      BigInt((req.user as any).companyId),
      uuid,
      dto,
    );
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get Role By UUID',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role fetched successfully.',
  })
  findOne(
    @Req() req: Request,
    @Param('uuid')
    uuid: string,
  ) {
    return this.roleService.findOne(BigInt((req.user as any).companyId), uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update Role',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully.',
  })
  update(
    @Req() req: Request,
    @Param('uuid')
    uuid: string,
    @Body()
    dto: UpdateRoleDto,
  ) {
    return this.roleService.update(
      BigInt((req.user as any).companyId),
      uuid,
      dto,
    );
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Role',
  })
  @ApiParam({
    name: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully.',
  })
  remove(
    @Req() req: Request,
    @Param('uuid')
    uuid: string,
  ) {
    return this.roleService.delete(BigInt((req.user as any).companyId), uuid);
  }
}
