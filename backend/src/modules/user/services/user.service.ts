import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  Prisma,
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  UserRepository,
  UserAccessBoundary,
} from "../repositories/user.repository";

import {
  EmployeeRepository,
} from "../../employee/repositories/employee.repository";

import {
  RoleRepository,
} from "../../roles/repositories/role.repository";

import {
  UserPolicy,
} from "../../authorization/policies/user.policy";

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

interface AuthUser {
  id: bigint;
}

export interface CreateUserContext {
  userType: UserType;

  companyId?: bigint;

  status?: UserStatus;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository:
      UserRepository,

    private readonly employeeRepository:
      EmployeeRepository,

    private readonly roleRepository:
      RoleRepository,

    private readonly userPolicy:
      UserPolicy,
  ) {}

  /*
   * Internal generic user creation.
   *
   * companyId / userType client DTO se
   * nahi aayenge.
   *
   * Calling service server-controlled
   * context provide karegi.
   */
  async create(
    dto: CreateUserDto,
    context: CreateUserContext,
    tx?: Prisma.TransactionClient,
  ) {
    const normalizedEmail =
      dto.email
        ?.trim()
        .toLowerCase();

    const normalizedMobile =
      dto.mobile
        ?.trim();

    if (normalizedEmail) {
      const existingEmail =
        await this.userRepository.findByEmail(
          normalizedEmail,
        );

      if (existingEmail) {
        throw new ConflictException(
          "Email already exists.",
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
          context.userType,

        status:
          context.status ??
          UserStatus.ACTIVE,

        ...(context.companyId !==
          undefined && {
          company: {
            connect: {
              id:
                context.companyId,
            },
          },
        }),
      },
      tx,
    );
  }

  /*
   * Internal company bootstrap helper.
   */
  async findCompanyAdmin(
    companyId: bigint,
  ) {
    return this.userRepository.findCompanyAdmin(
      companyId,
    );
  }

  /*
   * CREATE permission ke liye target
   * Employee boundary.
   *
   * company.user.create allowed scopes:
   * ORGANIZATION_UNIT / COMPANY
   */
  private assertEmployeeAccess(
    access: UserAccessBoundary,
    organizationUnitId:
      bigint | null,
  ) {
    if (
      access.companyAccess
    ) {
      return;
    }

    if (
      organizationUnitId !==
        null &&
      access.organizationUnitIds.some(
        (id) =>
          id ===
          organizationUnitId,
      )
    ) {
      return;
    }

    /*
     * Unauthorized employee ki existence
     * expose nahi karni.
     */
    throw new NotFoundException(
      "Employee not found.",
    );
  }

  /*
   * GET /users
   */
  async findAll(
    user: AuthUser,
    query: UserQueryDto,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.view",
      );

    let roleId:
      bigint | undefined;

    if (query.roleUuid) {
      const role =
        await this.roleRepository.findByUuid(
          access.companyId,
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
        access,
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
   * GET /users/:userUuid
   */
  async findByUuid(
    user: AuthUser,
    userUuid: string,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.view",
      );

    const targetUser =
      await this.userRepository.findByUuid(
        access,
        userUuid,
      );

    if (!targetUser) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    return {
      message:
        "User fetched successfully.",

      user:
        targetUser,
    };
  }

  /*
   * Shared permission response builder.
   *
   * Isse updatePermissions() ke baad
   * separate VIEW permission resolve
   * karne ki zarurat nahi padegi.
   */
  private async buildPermissionResponse(
    access: UserAccessBoundary,
    userUuid: string,
  ) {
    const user =
      await this.userRepository
        .findUserWithPermissions(
          access,
          userUuid,
        );

    if (!user) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    /*
     * Platform users company
     * UserPermission flow ka part nahi.
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
     * Same permission different scopes
     * preserve karo.
     *
     * Key:
     * permissionUuid + scope
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
       * Same permission + same scope direct
       * USER grant ho to USER source return.
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
                  user.employee.employeeCode,

                displayName:
                  user.employee.displayName,
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
   * GET /users/:userUuid/permissions
   *
   * Recommended permission:
   * company.user_permission.view
   *
   * Allowed:
   * ORGANIZATION_UNIT / COMPANY
   */
  async findPermissions(
    user: AuthUser,
    userUuid: string,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user_permission.view",
      );

    return this.buildPermissionResponse(
      access,
      userUuid,
    );
  }

  /*
   * PUT /users/:userUuid/permissions
   *
   * Recommended permission:
   * company.user_permission.update
   */
  async updatePermissions(
    user: AuthUser,
    userUuid: string,
    dto: AssignUserPermissionsDto,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user_permission.update",
      );

    const targetUser =
      await this.userRepository
        .findUserWithPermissions(
          access,
          userUuid,
        );

    if (!targetUser) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    if (
      targetUser.userType ===
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
     * Repository COMPANY + ACTIVE +
     * non-deleted permissions hi return
     * karti hai.
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
            throw new BadRequestException(
              "Invalid permission.",
            );
          }

          /*
           * Very important:
           *
           * DTO ka PermissionScope enum valid
           * hona enough nahi hai.
           *
           * Requested scope Permission ke
           * allowedScopes me hona chahiye.
           */
          if (
            !permission.allowedScopes.includes(
              item.scope,
            )
          ) {
            throw new BadRequestException(
              `Scope ${item.scope} is not allowed for permission ${permission.code}.`,
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

    await this.userRepository
      .replaceUserPermissions(
        targetUser.id,
        assignments,
      );

    /*
     * Same UPDATE boundary se fresh
     * permissions return karo.
     */
    return this.buildPermissionResponse(
      access,
      userUuid,
    );
  }

  /*
   * POST /users/employees/:employeeUuid
   *
   * company.user.create
   * → ORGANIZATION_UNIT / COMPANY
   */
  async createEmployeeUserAccount(
    user: AuthUser,
    employeeUuid: string,
    dto: CreateEmployeeUserAccountDto,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.create",
      );

    /*
     * Employee Repository abhi Employee
     * authorization refactor se pehle hai,
     * isliye same-company lookup use.
     *
     * User boundary separately enforce
     * hogi below.
     */
    const employee =
      await this.employeeRepository.findByUuid(
        access.companyId,
        employeeUuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    this.assertEmployeeAccess(
      access,
      employee.organizationUnitId,
    );

    const existingAccount =
      await this.userRepository.findByEmployee(
        access.companyId,
        employee.id,
      );

    if (existingAccount) {
      throw new ConflictException(
        "User account already exists for this employee.",
      );
    }

    /*
     * Role must belong to same tenant.
     */
    const role =
      await this.roleRepository.findByUuid(
        access.companyId,
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
      employee.mobile
        ?.trim();

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
        employee.lastName ??
        ""
      }`.trim();

    const createdUser =
      await this.userRepository.create({
        company: {
          connect: {
            id:
              access.companyId,
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

        /*
         * Server controlled.
         */
        userType:
          UserType.EMPLOYEE,

        status:
          dto.status ??
          UserStatus.ACTIVE,
      });

    return {
      message:
        "Employee user account created successfully.",

      user:
        createdUser,
    };
  }

  /*
   * GET /users/employees/:employeeUuid
   */
  async findEmployeeUserAccount(
    user: AuthUser,
    employeeUuid: string,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.view",
      );

    const targetUser =
      await this.userRepository
        .findByEmployeeUuid(
          access,
          employeeUuid,
        );

    if (!targetUser) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    return {
      message:
        "Employee user account fetched successfully.",

      user:
        targetUser,
    };
  }

  /*
   * PATCH /users/employees/:employeeUuid
   *
   * NOTE:
   * Ye role/status administrative update hai.
   *
   * company.user.update recommended scopes:
   * ORGANIZATION_UNIT / COMPANY
   *
   * OWN yahan allow mat karna.
   */
  async updateEmployeeUserAccount(
    user: AuthUser,
    employeeUuid: string,
    dto: UpdateEmployeeUserAccountDto,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.update",
      );

    const targetUser =
      await this.userRepository
        .findByEmployeeUuid(
          access,
          employeeUuid,
        );

    if (!targetUser) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    const role =
      dto.roleUuid !==
      undefined
        ? await this.roleRepository.findByUuid(
            access.companyId,
            dto.roleUuid,
          )
        : undefined;

    if (
      dto.roleUuid !==
        undefined &&
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
        access,
        targetUser.id,
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

    if (!updatedUser) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    return {
      message:
        "Employee user account updated successfully.",

      user:
        updatedUser,
    };
  }

  /*
   * DELETE /users/employees/:employeeUuid
   *
   * company.user.delete
   * → ORGANIZATION_UNIT / COMPANY
   */
  async deleteEmployeeUserAccount(
    user: AuthUser,
    employeeUuid: string,
  ) {
    const access =
      await this.userPolicy.resolveAccess(
        user.id,
        "company.user.delete",
      );

    const targetUser =
      await this.userRepository
        .findByEmployeeUuid(
          access,
          employeeUuid,
        );

    if (!targetUser) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    const deletedUser =
      await this.userRepository.softDelete(
        access,
        targetUser.id,
      );

    if (!deletedUser) {
      throw new NotFoundException(
        "User account not found for this employee.",
      );
    }

    return {
      message:
        "Employee user account disabled successfully.",
    };
  }
}