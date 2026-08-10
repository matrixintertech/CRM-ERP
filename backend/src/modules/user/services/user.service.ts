import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  PermissionScope,
  Prisma,
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  UserRepository,
} from "../repositories/user.repository";

import {
  EmployeeRepository,
} from "../../employee/repositories/employee.repository";

import {
  RoleRepository,
} from "../../roles/repositories/role.repository";

import {
  CreateUserDto,
} from "../dto/create-user.dto";

import {
  CreateEmployeeUserAccountDto,
} from "../dto/create-employee-user-account.dto";

import {
  UpdateEmployeeUserAccountDto,
} from "../dto/update-employee-user-account.dto";

import {
  UserQueryDto,
} from "../dto/user-query.dto";

import {
  AssignUserPermissionsDto,
} from "../dto/assign-user-permissions.dto";


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository:
      UserRepository,

    private readonly employeeRepository:
      EmployeeRepository,

    private readonly roleRepository:
      RoleRepository,
  ) {}



  async create(
    dto: CreateUserDto,
    tx?: Prisma.TransactionClient,
  ) {
    const normalizedEmail =
      dto.email
        ?.trim()
        .toLowerCase();

    const normalizedMobile =
      dto.mobile?.trim();

    if (normalizedEmail) {
      const email =
        await this.userRepository.findByEmail(
          normalizedEmail,
        );

      if (email) {
        throw new ConflictException(
          "Email already exists.",
        );
      }
    }

    if (normalizedMobile) {
      const mobile =
        await this.userRepository.findByMobile(
          normalizedMobile,
        );

      if (mobile) {
        throw new ConflictException(
          "Mobile already exists.",
        );
      }
    }

    return this.userRepository.create(
      {
        displayName:
          dto.displayName.trim(),

        email:
          normalizedEmail,

        mobile:
          normalizedMobile,

        userType:
          dto.userType,

        status:
          dto.status,

        company:
          dto.companyId !== undefined
            ? {
                connect: {
                  id: BigInt(
                    dto.companyId,
                  ),
                },
              }
            : undefined,
      },
      tx,
    );
  }



  async findCompanyAdmin(
    companyId: bigint,
  ) {
    return this.userRepository.findCompanyAdmin(
      companyId,
    );
  }



  /*
   * Get all login users.
   *
   * companyId:
   * - company user ke liye company ID
   * - platform owner ke liye null
   */
async findAll(
  companyId: bigint | null,
  query: UserQueryDto,
) {
  let roleId:
    bigint | undefined;

  if (query.roleUuid) {
    if (companyId === null) {
      throw new BadRequestException(
        "Role filter is not supported for platform owner.",
      );
    }

    const role =
      await this.roleRepository.findByUuid(
        companyId,
        query.roleUuid,
      );

    if (!role) {
      throw new NotFoundException(
        "Role not found for this company.",
      );
    }

    roleId =
      role.id;
  }

  const {
    roleUuid: _roleUuid,
    ...filters
  } = query;

  const result =
    await this.userRepository.findAll(
      companyId,
      {
        ...filters,

        roleId,
      },
    );

  return {
    message:
      "Users fetched successfully.",

    users:
      result.users,

    pagination:
      result.pagination,
  };
}



  /*
   * Get one user by UUID.
   */
  async findByUuid(
    companyId: bigint | null,
    userUuid: string,
  ) {
    const user =
      await this.userRepository.findByUuid(
        companyId,
        userUuid,
      );

    if (!user) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    return {
      message:
        "User fetched successfully.",

      user,
    };
  }



  /*
   * Get:
   * - role permissions
   * - additional user permissions
   * - effective permissions
   */
async findPermissions(
  companyId: bigint | null,
  userUuid: string,
) {
  const user =
    await this.userRepository.findUserWithPermissions(
      companyId,
      userUuid,
    );

  if (!user) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  /*
   * UserPermission company-level
   * extra grants ke liye hai.
   *
   * PLATFORM_OWNER permissions
   * PlatformRole se manage hongi.
   */
  if (
    user.userType ===
    UserType.PLATFORM_OWNER
  ) {
    throw new BadRequestException(
      "Platform owner permissions must be managed through platform roles.",
    );
  }

  const rolePermissions =
    user.role
      ?.rolePermissions
      .map(
        (item) => ({
          ...item.permission,

          scope:
            item.scope,

          source:
            "ROLE" as const,
        }),
      ) ?? [];

  const additionalPermissions =
    user.extraPermissions.map(
      (item) => ({
        ...item.permission,

        scope:
          item.scope,

        source:
          "USER" as const,
      }),
    );

  /*
   * Same permission different scopes ke
   * saath valid ho sakti hai.
   *
   * Example:
   *
   * Role:
   * PROJECT_TASK_VIEW -> OWN
   *
   * Direct user grant:
   * PROJECT_TASK_VIEW -> PROJECT
   *
   * Isliye sirf permission UUID ke basis
   * par merge nahi karna.
   */
  type EffectivePermission =
    | (typeof rolePermissions)[number]
    | (typeof additionalPermissions)[number];

  const effectivePermissionMap =
    new Map<
      string,
      EffectivePermission
    >();

  for (
    const permission
    of rolePermissions
  ) {
    const key =
      `${permission.uuid}:${permission.scope}`;

    effectivePermissionMap.set(
      key,
      permission,
    );
  }

  for (
    const permission
    of additionalPermissions
  ) {
    const key =
      `${permission.uuid}:${permission.scope}`;

    /*
     * Same permission + same scope
     * direct grant ho to USER source
     * effective result me win karega.
     */
    effectivePermissionMap.set(
      key,
      permission,
    );
  }

  return {
    message:
      "User permissions fetched successfully.",

    user: {
      uuid:
        user.uuid,

      displayName:
        user.displayName,

      email:
        user.email,

      mobile:
        user.mobile,

      status:
        user.status,

      userType:
        user.userType,

      employee:
        user.employee
          ? {
              uuid:
                user.employee.uuid,

              employeeCode:
                user.employee
                  .employeeCode,

              displayName:
                user.employee
                  .displayName,
            }
          : null,
    },

    role:
      user.role
        ? {
            uuid:
              user.role.uuid,

            name:
              user.role.name,

            code:
              user.role.code,
          }
        : null,

    rolePermissions,

    additionalPermissions,

    effectivePermissions:
      Array.from(
        effectivePermissionMap.values(),
      ),
  };
}


  /*
   * Replace user-specific additional permissions.
   *
   * Role permissions is method se change nahi hongi.
   */
async updatePermissions(
  companyId: bigint | null,
  userUuid: string,
  dto: AssignUserPermissionsDto,
) {
  const user =
    await this.userRepository.findUserWithPermissions(
      companyId,
      userUuid,
    );

  if (!user) {
    throw new NotFoundException(
      "User not found.",
    );
  }

  /*
   * PLATFORM_OWNER ke permissions
   * UserPermission se manage nahi hongi.
   */
  if (
    user.userType ===
    UserType.PLATFORM_OWNER
  ) {
    throw new BadRequestException(
      "Platform owner permissions must be managed through platform roles.",
    );
  }

  const uniquePermissionUuids =
    Array.from(
      new Set(
        dto.permissions.map(
          (item) =>
            item.permissionUuid,
        ),
      ),
    );

  const permissions =
    uniquePermissionUuids.length >
      0
      ? await this.userRepository
          .findActivePermissionsByUuids(
            uniquePermissionUuids,
          )
      : [];

  /*
   * Repository already COMPANY type +
   * ACTIVE + non-deleted permissions
   * only return karta hai.
   */
  if (
    permissions.length !==
    uniquePermissionUuids.length
  ) {
    throw new BadRequestException(
      "One or more permissions are invalid, inactive, or not valid for company users.",
    );
  }

  const permissionByUuid =
    new Map(
      permissions.map(
        (permission) => [
          permission.uuid,
          permission,
        ],
      ),
    );

  const assignments =
    dto.permissions.map(
      (item) => {
        const permission =
          permissionByUuid.get(
            item.permissionUuid,
          );

        if (!permission) {
          /*
           * Count validation above ke baad
           * normally ye branch execute nahi hogi.
           */
          throw new BadRequestException(
            "Invalid permission.",
          );
        }

        return {
          permissionId:
            permission.id,

          scope:
            item.scope,
        };
      },
    );

  /*
   * IMPORTANT:
   *
   * Role me same permission already ho
   * tab bhi direct grant save kar sakte hain.
   *
   * Example:
   *
   * Role -> VIEW_TASK OWN
   * User -> VIEW_TASK PROJECT
   *
   * Direct grant role permission ko
   * replace nahi karta; access extend karta hai.
   */
  await this.userRepository.replaceUserPermissions(
    user.id,
    assignments,
  );

  /*
   * Fresh role + user + effective
   * permissions return karo.
   */
  return this.findPermissions(
    companyId,
    userUuid,
  );
}


  async createEmployeeUserAccount(
    companyId: bigint,
    employeeUuid: string,
    dto: CreateEmployeeUserAccountDto,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    const existingAccount =
      await this.userRepository.findByEmployee(
        companyId,
        employee.id,
      );

    if (existingAccount) {
      throw new ConflictException(
        "User account already exists for this employee.",
      );
    }

    const role =
      await this.roleRepository.findByUuid(
        companyId,
        dto.roleUuid,
      );

    if (!role) {
      throw new NotFoundException(
        "Role not found.",
      );
    }

    if (
      role.status !==
      "ACTIVE"
    ) {
      throw new BadRequestException(
        "Selected role is inactive.",
      );
    }

    const normalizedEmail =
      employee.email
        ?.trim()
        .toLowerCase();

    const normalizedMobile =
      employee.mobile.trim();

    if (
      !normalizedEmail &&
      !normalizedMobile
    ) {
      throw new BadRequestException(
        "Employee email or mobile is required.",
      );
    }

    if (normalizedEmail) {
      const existingEmail =
        await this.userRepository.findByEmail(
          normalizedEmail,
        );

      if (existingEmail) {
        throw new ConflictException(
          "Email is already used by another user.",
        );
      }
    }

    if (normalizedMobile) {
      const existingMobile =
        await this.userRepository.findByMobile(
          normalizedMobile,
        );

      if (existingMobile) {
        throw new ConflictException(
          "Mobile is already used by another user.",
        );
      }
    }

    const displayName =
      employee.displayName ||
      `${employee.firstName} ${
        employee.lastName ?? ""
      }`.trim();

    const user =
      await this.userRepository.create({
        company: {
          connect: {
            id:
              companyId,
          },
        },

        employee: {
          connect: {
            id:
              employee.id,
          },
        },

        role: {
          connect: {
            id:
              role.id,
          },
        },

        displayName,

        email:
          normalizedEmail,

        mobile:
          normalizedMobile,

        profilePhoto:
          employee.avatarUrl,

        userType:
          UserType.EMPLOYEE,

        status:
          dto.status ??
          UserStatus.ACTIVE,
      });

    return {
      message:
        "Employee user account created successfully.",

      user,
    };
  }



  async findEmployeeUserAccount(
    companyId: bigint,
    employeeUuid: string,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    const user =
      await this.userRepository.findByEmployee(
        companyId,
        employee.id,
      );

    if (!user) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    return {
      message:
        "Employee user account fetched successfully.",

      user,
    };
  }



  async updateEmployeeUserAccount(
    companyId: bigint,
    employeeUuid: string,
    dto: UpdateEmployeeUserAccountDto,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    const user =
      await this.userRepository.findByEmployee(
        companyId,
        employee.id,
      );

    if (!user) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    const role =
      dto.roleUuid !== undefined
        ? await this.roleRepository.findByUuid(
            companyId,
            dto.roleUuid,
          )
        : undefined;

    if (
      dto.roleUuid !== undefined &&
      !role
    ) {
      throw new NotFoundException(
        "Role not found.",
      );
    }

    if (
      role &&
      role.status !==
        "ACTIVE"
    ) {
      throw new BadRequestException(
        "Selected role is inactive.",
      );
    }

    const updatedUser =
      await this.userRepository.update(
        user.id,
        {
          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),

          ...(role && {
            role: {
              connect: {
                id:
                  role.id,
              },
            },
          }),
        },
      );

    return {
      message:
        "Employee user account updated successfully.",

      user:
        updatedUser,
    };
  }



  async deleteEmployeeUserAccount(
    companyId: bigint,
    employeeUuid: string,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    const user =
      await this.userRepository.findByEmployee(
        companyId,
        employee.id,
      );

    if (!user) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    await this.userRepository.softDelete(
      user.id,
    );

    return {
      message:
        "Employee user account disabled successfully.",
    };
  }
}