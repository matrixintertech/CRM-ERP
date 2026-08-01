import {
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
    private readonly employeeRepository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly designationRepository: DesignationRepository,
    private readonly organizationUnitRepository: OrganizationUnitRepository,
  ) {}

  /**
   * Create Employee
   */
async create(
  companyId: bigint,
  dto: CreateEmployeeDto,
) {
  // Email duplicate check
  if (dto.email) {
    const existingEmail = await this.employeeRepository.findByEmail(
      companyId,
      dto.email,
    );

    if (existingEmail) {
      throw new ConflictException("Email already exists.");
    }
  }

  // Mobile duplicate check
  const existingMobile = await this.employeeRepository.findByMobile(
    companyId,
    dto.mobile,
  );

  if (existingMobile) {
    throw new ConflictException("Mobile already exists.");
  }

  // Organization Unit
  let organizationUnit;

  if (dto.organizationUnitId) {
    organizationUnit =
      await this.organizationUnitRepository.findByUuid(
         companyId,
        dto.organizationUnitId,
      );

    if (!organizationUnit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }
  }

  // Department
  let department;

  if (dto.departmentId) {
    department =
      await this.departmentRepository.findByUuid(
         companyId,
        dto.departmentId,
      );

    if (!department) {
      throw new NotFoundException("Department not found.");
    }
  }

  // Designation
  let designation;

  if (dto.designationId) {
    designation =
      await this.designationRepository.findByUuid(
         companyId,
        dto.designationId,
      );

    if (!designation) {
      throw new NotFoundException("Designation not found.");
    }
  }

  // Reporting Manager
  let manager;

  if (dto.managerId) {
    manager = await this.employeeRepository.findByUuid(
      companyId,
      dto.managerId,
    );

    if (!manager) {
      throw new NotFoundException("Reporting manager not found.");
    }
  }

  // Employee Code
  const totalEmployees =
    await this.employeeRepository.count(companyId);

  const employeeCode = `EMP${String(
    totalEmployees + 1,
  ).padStart(5, "0")}`;

  // Create Employee
  return this.employeeRepository.create({
    employeeCode,

    firstName: dto.firstName,
    lastName: dto.lastName,
    displayName: dto.displayName,

    email: dto.email,
    mobile: dto.mobile,

    gender: dto.gender,

    joiningDate: dto.joiningDate
      ? new Date(dto.joiningDate)
      : undefined,

    employmentType: dto.employmentType,

    avatarUrl: dto.avatarUrl,

    status: dto.status,

    company: {
      connect: {
        id: companyId,
      },
    },

    organizationUnit: organizationUnit
      ? {
          connect: {
            id: organizationUnit.id,
          },
        }
      : undefined,

    department: department
      ? {
          connect: {
            id: department.id,
          },
        }
      : undefined,

    designation: designation
      ? {
          connect: {
            id: designation.id,
          },
        }
      : undefined,

    manager: manager
      ? {
          connect: {
            id: manager.id,
          },
        }
      : undefined,
  });
}

  /**
   * Get All Employees
   */
async findAll(companyId: bigint) {
  return this.employeeRepository.findAll({
    companyId,
  });
}

  /**
   * Get Employee By UUID
   */
async findOne(
  companyId: bigint,
  uuid: string,
) {
  const employee = await this.employeeRepository.findByUuid(
    companyId,
    uuid,
  );

  if (!employee) {
    throw new NotFoundException("Employee not found.");
  }

  return employee;
}

  /**
   * Update Employee
   */
async update(
  companyId: bigint,
  uuid: string,
  dto: UpdateEmployeeDto,
) {
  // Find Employee
  const employee = await this.employeeRepository.findByUuid(
    companyId,
    uuid,
  );

  if (!employee) {
    throw new NotFoundException("Employee not found.");
  }

  // Validate Email
  await this.validateEmail(
    companyId,
    dto.email,
    employee.id,
  );

  // Validate Mobile
  if (dto.mobile) {
    await this.validateMobile(
      companyId,
      dto.mobile,
      employee.id,
    );
  }

  // Validate Organization Unit
  const organizationUnit =
    await this.validateOrganizationUnit(
      companyId,
      dto.organizationUnitId,
    );

  // Validate Department
  const department =
    await this.validateDepartment(
      companyId,
      dto.departmentId,
    );

  // Validate Designation
  const designation =
    await this.validateDesignation(
      companyId,
      dto.designationId,
    );

  // Validate Reporting Manager
  const manager = await this.validateManager(
    companyId,
    dto.managerId,
  );

  return this.employeeRepository.update(employee.id, {
    firstName: dto.firstName,
    lastName: dto.lastName,
    displayName: dto.displayName,

    email: dto.email,
    mobile: dto.mobile,

    gender: dto.gender,

    joiningDate: dto.joiningDate
      ? new Date(dto.joiningDate)
      : undefined,

    employmentType: dto.employmentType,

    avatarUrl: dto.avatarUrl,

    status: dto.status,

    organizationUnit: organizationUnit
      ? {
          connect: {
            id: organizationUnit.id,
          },
        }
      : undefined,

    department: department
      ? {
          connect: {
            id: department.id,
          },
        }
      : undefined,

    designation: designation
      ? {
          connect: {
            id: designation.id,
          },
        }
      : undefined,

    manager: manager
      ? {
          connect: {
            id: manager.id,
          },
        }
      : undefined,
  });
}

  /**
   * Delete Employee (Soft Delete)
   */
async remove(
  companyId: bigint,
  uuid: string,
) {
  const employee = await this.employeeRepository.findByUuid(
    companyId,
    uuid,
  );

  if (!employee) {
    throw new NotFoundException("Employee not found.");
  }

  await this.employeeRepository.softDelete(
    employee.id,
  );

  return {
    message: "Employee deleted successfully.",
  };
}

  // -------------------------------------------------------
  // Private Helper Methods
  // -------------------------------------------------------

  /**
   * Generate Employee Code
   */
  private async generateEmployeeCode(
    companyId: bigint,
  ): Promise<string> {
    // TODO: Implement
    return "";
  }

  /**
   * Validate Organization Unit
   */
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

  /**
   * Validate Department
   */
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
    throw new NotFoundException("Department not found.");
  }

  return department;
}

  /**
   * Validate Designation
   */
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
    throw new NotFoundException("Designation not found.");
  }

  return designation;
}

  /**
   * Validate Reporting Manager
   */
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

  /**
   * Check Duplicate Email
   */
private async validateEmail(
  companyId: bigint,
  email?: string,
  ignoreEmployeeId?: bigint,
) {
  if (!email) {
    return;
  }

  const employee = await this.employeeRepository.findByEmail(
    companyId,
    email,
  );

  if (
    employee &&
    (!ignoreEmployeeId || employee.id !== ignoreEmployeeId)
  ) {
    throw new ConflictException(
      "Email already exists.",
    );
  }
}

  /**
   * Check Duplicate Mobile
   */
private async validateMobile(
  companyId: bigint,
  mobile: string,
  ignoreEmployeeId?: bigint,
) {
  const employee = await this.employeeRepository.findByMobile(
    companyId,
    mobile,
  );

  if (
    employee &&
    (!ignoreEmployeeId || employee.id !== ignoreEmployeeId)
  ) {
    throw new ConflictException(
      "Mobile number already exists.",
    );
  }
}
}