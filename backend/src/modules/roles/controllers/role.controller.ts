import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Put,
  NotFoundException 
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import{ AssignRolePermissionsDto } from '../dto/assign-role-permissions.dto';

import { RoleService } from '../services/role.service';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Role',
  })
  @ApiResponse({
    status: 201,
    description:
      'Role created successfully.',
  })
  create(
    @Body()
    dto: CreateRoleDto,
  ) {
    return this.roleService.create(
      dto,
    );
  }



  @Get('company/:companyId')
@ApiOperation({
  summary: 'Get Roles by Company',
})
@ApiResponse({
  status: 200,
  description:
    'Roles fetched successfully.',
})
findAll(
  @Param(
    'companyId',
    ParseIntPipe,
  )
  companyId: number,
) {
  return this.roleService.findAll(
    companyId,
  );
}


@Get(':id')
@ApiOperation({
  summary: 'Get Role',
})
@ApiResponse({
  status: 200,
  description:
    'Role fetched successfully.',
})
findOne(
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.roleService.findOne(
    id,
  );
}

@Patch(':id')
@ApiOperation({
  summary: 'Update Role',
})
@ApiResponse({
  status: 200,
  description:
    'Role updated successfully.',
})
update(
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,

  @Body()
  dto: UpdateRoleDto,
) {
  return this.roleService.update(
    id,
    dto,
  );
}

@Delete(':id')
@ApiOperation({
  summary: 'Delete Role',
})
@ApiResponse({
  status: 200,
  description:
    'Role deleted successfully.',
})
delete(
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,
) {
  return this.roleService.delete(
    id,
  );
}


@Get(":id/permissions")
@ApiOperation({
  summary: "Get Role Permissions",
})
@ApiResponse({
  status: 200,
  description:
    "Role permissions fetched successfully.",
})
findRolePermissions(
  @Param("id")
  id: string,
) {
  return this.roleService.findRolePermissions(
    BigInt(id),
  );
}

@Put(":id/permissions")
@ApiOperation({
  summary: "Assign Permissions",
})
assignPermissions(
  @Param("id")
  id: string,

  @Body()
  dto: AssignRolePermissionsDto,
) {
  return this.roleService.assignPermissions(
    BigInt(id),
    dto,
  );
}


}