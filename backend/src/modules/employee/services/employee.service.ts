import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";

import { EmployeeRepository } from "../repositories/employee.repository";

import { DepartmentRepository } from "../../department/repositories/department.repository";
import { DesignationRepository } from "../../designation/repositories/designation.repository";
import { OrganizationUnitRepository } from "../../organization-unit/repositories/organization-unit.repository";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository:
      EmployeeRepository,

    private readonly departmentRepository:
      DepartmentRepository,

    private readonly designationRepository:
      DesignationRepository,

    private readonly organizationUnitRepository:
      OrganizationUnitRepository,
  ) {}

  async create(
    companyId: bigint,
    dto: CreateEmployeeDto,
  ) {
    if (dto.email) {
      const normalizedEmail =
        dto.email
          .trim()
          .toLowerCase();

      const existingEmail =
        await this.employeeRepository.findByEmail(
          companyId,
          normalizedEmail,
        );

      if (existingEmail) {
        throw new ConflictException(
          "Email already exists.",
        );
      }
    }

    const normalizedMobile =
      dto.mobile.trim();

    const existingMobile =
      await this.employeeRepository.findByMobile(
        companyId,
        normalizedMobile,
      );

    if (existingMobile) {
      throw new ConflictException(
        "Mobile already exists.",
      );
    }

    const organizationUnit =
      await this.validateOrganizationUnit(
        companyId,
        dto.organizationUnitUuid,
      );

    const department =
      await this.validateDepartment(
        companyId,
        dto.departmentUuid,
      );

    const designation =
      await this.validateDesignation(
        companyId,
        dto.designationUuid,
      );

    const manager =
      await this.validateManager(
        companyId,
        dto.managerUuid,
      );

    if (
      organizationUnit &&
      department &&
      department.organizationUnitId !==
        organizationUnit.id
    ) {
      throw new BadRequestException(
        "Selected department does not belong to the selected organization unit.",
      );
    }

    if (
      department &&
      designation &&
      designation.departmentId !==
        department.id
    ) {
      throw new BadRequestException(
        "Selected designation does not belong to the selected department.",
      );
    }

    const employeeCode =
      await this.generateEmployeeCode(
        companyId,
      );

    return this.employeeRepository.create({
      employeeCode,

      firstName:
        dto.firstName.trim(),

      lastName:
        dto.lastName?.trim(),

      displayName:
        dto.displayName?.trim(),

      email:
        dto.email
          ?.trim()
          .toLowerCase(),

      mobile:
        normalizedMobile,

      gender:
        dto.gender,

      joiningDate:
        dto.joiningDate
          ? new Date(dto.joiningDate)
          : undefined,

      employmentType:
        dto.employmentType,

      avatarUrl:
        dto.avatarUrl?.trim(),

      status:
        dto.status,

      company: {
        connect: {
          id: companyId,
        },
      },

      organizationUnit:
        organizationUnit
          ? {
              connect: {
                id:
                  organizationUnit.id,
              },
            }
          : undefined,

      department:
        department
          ? {
              connect: {
                id:
                  department.id,
              },
            }
          : undefined,

      designation:
        designation
          ? {
              connect: {
                id:
                  designation.id,
              },
            }
          : undefined,

      manager:
        manager
          ? {
              connect: {
                id:
                  manager.id,
              },
            }
          : undefined,
    });
  }

  async findAll(
    companyId: bigint,
  ) {
    return this.employeeRepository.findAll({
      companyId,
    });
  }

  async findOne(
    companyId: bigint,
    uuid: string,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    return employee;
  }

  async update(
    companyId: bigint,
    uuid: string,
    dto: UpdateEmployeeDto,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    await this.validateEmail(
      companyId,
      dto.email,
      employee.id,
    );

    if (dto.mobile) {
      await this.validateMobile(
        companyId,
        dto.mobile,
        employee.id,
      );
    }

    const organizationUnit =
      dto.organizationUnitUuid !==
      undefined
        ? await this.validateOrganizationUnit(
            companyId,
            dto.organizationUnitUuid,
          )
        : undefined;

    const department =
      dto.departmentUuid !== undefined
        ? await this.validateDepartment(
            companyId,
            dto.departmentUuid,
          )
        : undefined;

    const designation =
      dto.designationUuid !== undefined
        ? await this.validateDesignation(
            companyId,
            dto.designationUuid,
          )
        : undefined;

    const manager =
      dto.managerUuid !== undefined
        ? await this.validateManager(
            companyId,
            dto.managerUuid,
          )
        : undefined;

    if (
      manager &&
      manager.id === employee.id
    ) {
      throw new BadRequestException(
        "Employee cannot be their own reporting manager.",
      );
    }

    const finalOrganizationUnitId =
      dto.organizationUnitUuid !==
      undefined
        ? organizationUnit?.id ?? null
        : employee.organizationUnitId;

    const finalDepartmentId =
      dto.departmentUuid !== undefined
        ? department?.id ?? null
        : employee.departmentId;

    if (
      department &&
      finalOrganizationUnitId &&
      department.organizationUnitId !==
        finalOrganizationUnitId
    ) {
      throw new BadRequestException(
        "Selected department does not belong to the selected organization unit.",
      );
    }

    if (
      designation &&
      finalDepartmentId &&
      designation.departmentId !==
        finalDepartmentId
    ) {
      throw new BadRequestException(
        "Selected designation does not belong to the selected department.",
      );
    }

    return this.employeeRepository.update(
      employee.id,
      {
        ...(dto.firstName !==
          undefined && {
          firstName:
            dto.firstName.trim(),
        }),

        ...(dto.lastName !==
          undefined && {
          lastName:
            dto.lastName.trim() ||
            null,
        }),

        ...(dto.displayName !==
          undefined && {
          displayName:
            dto.displayName.trim() ||
            null,
        }),

        ...(dto.email !== undefined && {
          email:
            dto.email
              .trim()
              .toLowerCase() ||
            null,
        }),

        ...(dto.mobile !==
          undefined && {
          mobile:
            dto.mobile.trim(),
        }),

        ...(dto.gender !==
          undefined && {
          gender:
            dto.gender,
        }),

        ...(dto.joiningDate !==
          undefined && {
          joiningDate:
            dto.joiningDate
              ? new Date(
                  dto.joiningDate,
                )
              : null,
        }),

        ...(dto.employmentType !==
          undefined && {
          employmentType:
            dto.employmentType,
        }),

        ...(dto.avatarUrl !==
          undefined && {
          avatarUrl:
            dto.avatarUrl.trim() ||
            null,
        }),

        ...(dto.status !==
          undefined && {
          status:
            dto.status,
        }),

        ...(dto.organizationUnitUuid !==
          undefined && {
          organizationUnit:
            organizationUnit
              ? {
                  connect: {
                    id:
                      organizationUnit.id,
                  },
                }
              : {
                  disconnect: true,
                },
        }),

        ...(dto.departmentUuid !==
          undefined && {
          department:
            department
              ? {
                  connect: {
                    id:
                      department.id,
                  },
                }
              : {
                  disconnect: true,
                },
        }),

        ...(dto.designationUuid !==
          undefined && {
          designation:
            designation
              ? {
                  connect: {
                    id:
                      designation.id,
                  },
                }
              : {
                  disconnect: true,
                },
        }),

        ...(dto.managerUuid !==
          undefined && {
          manager:
            manager
              ? {
                  connect: {
                    id:
                      manager.id,
                  },
                }
              : {
                  disconnect: true,
                },
        }),
      },
    );
  }

  async remove(
    companyId: bigint,
    uuid: string,
  ) {
    const employee =
      await this.employeeRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!employee) {
      throw new NotFoundException(
        "Employee not found.",
      );
    }

    await this.employeeRepository.softDelete(
      employee.id,
    );

    return {
      message:
        "Employee deleted successfully.",
    };
  }

  private async generateEmployeeCode(
    companyId: bigint,
  ): Promise<string> {
    const totalEmployees =
      await this.employeeRepository.count(
        companyId,
      );

    return `EMP${String(
      totalEmployees + 1,
    ).padStart(5, "0")}`;
  }

  private async validateOrganizationUnit(
    companyId: bigint,
    uuid?: string,
  ) {
    if (!uuid) {
      return null;
    }

    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization Unit not found.",
      );
    }

    return organizationUnit;
  }

  private async validateDepartment(
    companyId: bigint,
    uuid?: string,
  ) {
    if (!uuid) {
      return null;
    }

    const department =
      await this.departmentRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!department) {
      throw new NotFoundException(
        "Department not found.",
      );
    }

    return department;
  }

  private async validateDesignation(
    companyId: bigint,
    uuid?: string,
  ) {
    if (!uuid) {
      return null;
    }

    const designation =
      await this.designationRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!designation) {
      throw new NotFoundException(
        "Designation not found.",
      );
    }

    return designation;
  }

  private async validateManager(
    companyId: bigint,
    uuid?: string,
  ) {
    if (!uuid) {
      return null;
    }

    const manager =
      await this.employeeRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!manager) {
      throw new NotFoundException(
        "Reporting Manager not found.",
      );
    }

    return manager;
  }

  private async validateEmail(
    companyId: bigint,
    email?: string,
    ignoreEmployeeId?: bigint,
  ) {
    if (!email) {
      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const employee =
      await this.employeeRepository.findByEmail(
        companyId,
        normalizedEmail,
      );

    if (
      employee &&
      employee.id !==
        ignoreEmployeeId
    ) {
      throw new ConflictException(
        "Email already exists.",
      );
    }
  }

  private async validateMobile(
    companyId: bigint,
    mobile: string,
    ignoreEmployeeId?: bigint,
  ) {
    const normalizedMobile =
      mobile.trim();

    const employee =
      await this.employeeRepository.findByMobile(
        companyId,
        normalizedMobile,
      );

    if (
      employee &&
      employee.id !==
        ignoreEmployeeId
    ) {
      throw new ConflictException(
        "Mobile number already exists.",
      );
    }
  }
}