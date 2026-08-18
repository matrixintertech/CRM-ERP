import {
  PermissionScope,
} from "@prisma/client";


export interface CompanyAdminPermissionDefinition {
  code: string;

  scope: PermissionScope;

  /**
   * required = true
   *
   * Company Admin system role se
   * ye permission remove nahi ki ja sakti.
   */
  required: boolean;
}


export const COMPANY_ADMIN_PERMISSION_TEMPLATE:
  CompanyAdminPermissionDefinition[] = [
  /*
   * =========================================================
   * DASHBOARD
   * =========================================================
   */

  {
    code: "dashboard.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * CLIENT
   * =========================================================
   */

  {
    code: "company.client.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.client.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.client.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.client.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * ORGANIZATION UNIT
   * =========================================================
   */

  {
    code: "company.organization_unit.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.organization_unit.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.organization_unit.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.organization_unit.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * DEPARTMENT
   * =========================================================
   */

  {
    code: "company.department.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.department.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.department.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.department.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * DESIGNATION
   * =========================================================
   */

  {
    code: "company.designation.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.designation.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.designation.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.designation.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * EMPLOYEE
   *
   * Required because Company Admin must retain
   * access to company users/employees management.
   * =========================================================
   */

  {
    code: "company.employee.view",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.employee.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.employee.update",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.employee.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * PERMISSION CATALOG
   * =========================================================
   */

  {
    code: "company.permission.view",
    scope: PermissionScope.COMPANY,
    required: true,
  },


  /*
   * =========================================================
   * COMPANY ROLE
   *
   * These are lockout-critical.
   * Company Admin must always retain the ability
   * to view and manage role permissions.
   * =========================================================
   */

  {
    code: "company.role.view",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.role.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.role.update",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.role.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * COMPANY USER
   *
   * User view/update are required so Company Admin
   * cannot lose the ability to manage company users.
   * =========================================================
   */

  {
    code: "company.user.view",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.user.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.user.update",
    scope: PermissionScope.COMPANY,
    required: true,
  },

  {
    code: "company.user.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * DIRECT USER PERMISSIONS
   * =========================================================
   */

  {
    code: "company.user_permission.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.user_permission.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * PROJECT
   * =========================================================
   */

  {
    code: "company.project.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * PROJECT CATEGORY
   * =========================================================
   */

  {
    code: "company.project_category.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_category.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_category.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_category.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * PROJECT ROLE
   * =========================================================
   */

  {
    code: "company.project_role.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_role.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_role.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.project_role.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * =========================================================
   * TASK MANAGEMENT
   * =========================================================
   */

  {
    code: "company.task.view",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.task.create",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.task.update",
    scope: PermissionScope.COMPANY,
    required: false,
  },

  {
    code: "company.task.delete",
    scope: PermissionScope.COMPANY,
    required: false,
  },


  /*
   * company.task.execute intentionally NOT assigned
   * to Company Admin template.
   *
   * execute permission is OWN-scoped employee task
   * execution capability. Company Admin agar project
   * task personally execute karega to employee/other role
   * through ye grant diya ja sakta hai.
   */
];