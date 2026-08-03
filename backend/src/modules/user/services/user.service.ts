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

import { UserRepository } from "../repositories/user.repository";
import { EmployeeRepository } from "../../employee/repositories/employee.repository";
import { RoleRepository } from "../../roles/repositories/role.repository";

import { CreateUserDto } from "../dto/create-user.dto";
import { CreateEmployeeUserAccountDto } from "../dto/create-employee-user-account.dto";
import { UpdateEmployeeUserAccountDto } from "../dto/update-employee-user-account.dto";

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

    if (role.status !== "ACTIVE") {
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
            id: companyId,
          },
        },

        employee: {
          connect: {
            id: employee.id,
          },
        },

        role: {
          connect: {
            id: role.id,
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
      role.status !== "ACTIVE"
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
                id: role.id,
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