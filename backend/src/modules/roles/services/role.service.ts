import {
  ConflictException,
  Injectable,
  NotFoundException,
  
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignRolePermissionsDto } from '../dto/assign-role-permissions.dto';

import { RoleRepository } from '../repositories/role.repository';


@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async create(
    dto: CreateRoleDto,
    tx?: Prisma.TransactionClient,
  ) {
    // 1. Company Exists
    const company =
      await this.roleRepository.findCompanyById(
        BigInt(dto.companyId),
      );

    if (!company) {
      throw new NotFoundException(
        'Company not found.',
      );
    }

    // 2. Role Code
    const roleCode =
      await this.roleRepository.findByCode(
        BigInt(dto.companyId),
        dto.code,
      );

    if (roleCode) {
      throw new ConflictException(
        'Role code already exists.',
      );
    }

    // 3. Role Name
    const roleName =
      await this.roleRepository.findByName(
        BigInt(dto.companyId),
        dto.name,
      );

    if (roleName) {
      throw new ConflictException(
        'Role name already exists.',
      );
    }

    // 4. Create Role
    const role =
      await this.roleRepository.create(
        {
          company: {
            connect: {
              id: BigInt(
                dto.companyId,
              ),
            },
          },

          name: dto.name,

          code: dto.code,

          description:
            dto.description,

          isSystem:
            dto.isSystem ??
            false,
        },
        tx,
      );

    return {
      message:
        'Role created successfully.',

      role,
    };
  }


async findAll(
  companyId: number,
) {
  const company =
    await this.roleRepository.findCompanyById(
      BigInt(companyId),
    );

  if (!company) {
    throw new NotFoundException(
      'Company not found.',
    );
  }

  const roles =
    await this.roleRepository.findByCompanyId(
      BigInt(companyId),
    );

  return {
    message:
      'Roles fetched successfully.',
    roles,
  };
}


async findOne(
  id: number,
) {
  const role =
    await this.roleRepository.findById(
      BigInt(id),
    );

  if (!role) {
    throw new NotFoundException(
      'Role not found.',
    );
  }

  return {
    message:
      'Role fetched successfully.',
    role,
  };
}


async update(
  id: number,
  dto: UpdateRoleDto,
) {
  // 1. Role Exists
  const role =
    await this.roleRepository.findById(
      BigInt(id),
    );

  if (!role) {
    throw new NotFoundException(
      'Role not found.',
    );
  }

  // 2. Check Duplicate Code
  if (
    dto.code &&
    dto.code !== role.code
  ) {
    const roleCode =
      await this.roleRepository.findByCode(
        role.companyId,
        dto.code,
      );

    if (roleCode) {
      throw new ConflictException(
        'Role code already exists.',
      );
    }
  }

  // 3. Check Duplicate Name
  if (
    dto.name &&
    dto.name !== role.name
  ) {
    const roleName =
      await this.roleRepository.findByName(
        role.companyId,
        dto.name,
      );

    if (roleName) {
      throw new ConflictException(
        'Role name already exists.',
      );
    }
  }

  // 4. Update
  const updatedRole =
    await this.roleRepository.update(
      BigInt(id),
      dto,
    );

  return {
    message:
      'Role updated successfully.',
    role: updatedRole,
  };
}


async delete(
  id: number,
) {
  // 1. Role Exists
  const role =
    await this.roleRepository.findById(
      BigInt(id),
    );

  if (!role) {
    throw new NotFoundException(
      'Role not found.',
    );
  }

  // 2. System Role
  if (role.isSystem) {
    throw new ConflictException(
      'System role cannot be deleted.',
    );
  }

  // 3. Soft Delete
  await this.roleRepository.delete(
    BigInt(id),
  );

  return {
    message:
      'Role deleted successfully.',
  };
}


async findRolePermissions(
  roleId: bigint,
) {
  await this.findOne(
    Number(roleId),
  );

  const permissions =
    await this.roleRepository.findRolePermissions(
      roleId,
    );

  return {
    roleId: roleId.toString(),
    permissionIds:
      permissions.map((item) =>
        item.permissionId.toString(),
      ),
  };
}

async assignPermissions(
  roleId: bigint,
  dto: AssignRolePermissionsDto,
) {
  await this.findOne(
    Number(roleId),
  );

  await this.roleRepository.assignPermissions(
    roleId,
    dto.permissionIds,
  );

  return {
    message:
      "Permissions assigned successfully.",
  };
}

}