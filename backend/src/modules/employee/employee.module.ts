import { Module } from "@nestjs/common";

import { EmployeeController } from "./controllers/employee.controller";
import { EmployeeService } from "./services/employee.service";
import { EmployeeRepository } from "./repositories/employee.repository";

import { DepartmentRepository } from "../department/repositories/department.repository";
import { DesignationRepository } from "../designation/repositories/designation.repository";
import { OrganizationUnitRepository } from "../organization-unit/repositories/organization-unit.repository";

import { RoleModule } from "../roles/role.module";

@Module({
  imports: [
    RoleModule,
  ],

  controllers: [
    EmployeeController,
  ],

  providers: [
    EmployeeService,
    EmployeeRepository,

    DepartmentRepository,
    DesignationRepository,
    OrganizationUnitRepository,
  ],

  exports: [
    EmployeeService,
    EmployeeRepository,
  ],
})
export class EmployeeModule {}