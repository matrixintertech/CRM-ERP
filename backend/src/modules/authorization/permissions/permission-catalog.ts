import {
  PermissionScope,
  PermissionType,
} from "@prisma/client";


export interface PermissionDefinition {
  module:
    string;

  code:
    string;

  name:
    string;

  description?:
    string;

  type:
    PermissionType;

  allowedScopes:
    PermissionScope[];
}


export const PERMISSION_CATALOG:
  PermissionDefinition[] = [
  /*
   * =========================================================
   * CLIENT
   * =========================================================
   */

  {
    module:
      "CLIENT",

    code:
      "company.client.create",

    name:
      "Create Client",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "CLIENT",

    code:
      "company.client.delete",

    name:
      "Remove Client",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "CLIENT",

    code:
      "company.client.update",

    name:
      "Update Client",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "CLIENT",

    code:
      "company.client.view",

    name:
      "View Clients",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * PLATFORM COMPANY
   * =========================================================
   */

  {
    module:
      "COMPANY",

    code:
      "platform.company.create",

    name:
      "Create Company",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "COMPANY",

    code:
      "platform.company.delete",

    name:
      "Delete Company",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "COMPANY",

    code:
      "platform.company.update",

    name:
      "Update Company",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "COMPANY",

    code:
      "platform.company.view",

    name:
      "View Company List",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "COMPANY",

    code:
      "platform.company_admin.create",

    name:
      "Company Admin Create",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },


  /*
   * =========================================================
   * DASHBOARD
   *
   * Existing code intentionally preserved.
   * Do not rename without updating guards/routes.
   * =========================================================
   */

  {
    module:
      "DASHBOARD",

    code:
      "dashboard.view",

    name:
      "View Dashboard",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * DEPARTMENT
   * =========================================================
   */

  {
    module:
      "DEPARTMENT",

    code:
      "company.department.create",

    name:
      "Create Department",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DEPARTMENT",

    code:
      "company.department.delete",

    name:
      "Delete Department",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DEPARTMENT",

    code:
      "company.department.update",

    name:
      "Update Department",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DEPARTMENT",

    code:
      "company.department.view",

    name:
      "View Department",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },


  /*
   * =========================================================
   * DESIGNATION
   * =========================================================
   */

  {
    module:
      "DESIGNATION",

    code:
      "company.designation.create",

    name:
      "Create Designation",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DESIGNATION",

    code:
      "company.designation.delete",

    name:
      "Delete Designation",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DESIGNATION",

    code:
      "company.designation.update",

    name:
      "Update Designation",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "DESIGNATION",

    code:
      "company.designation.view",

    name:
      "View Designation",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },


  /*
   * =========================================================
   * EMPLOYEE
   * =========================================================
   */

  {
    module:
      "EMPLOYEE",

    code:
      "company.employee.create",

    name:
      "Create Employee",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "EMPLOYEE",

    code:
      "company.employee.delete",

    name:
      "Delete Employee",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "EMPLOYEE",

    code:
      "company.employee.update",

    name:
      "Update Employee",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "EMPLOYEE",

    code:
      "company.employee.view",

    name:
      "View Employee",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },


  /*
   * =========================================================
   * ORGANIZATION UNIT
   * =========================================================
   */

  {
    module:
      "ORGANIZATION",

    code:
      "company.organization_unit.create",

    name:
      "Create Organization",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "ORGANIZATION",

    code:
      "company.organization_unit.delete",

    name:
      "Delete Organization Unit",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "ORGANIZATION",

    code:
      "company.organization_unit.update",

    name:
      "Update Organization",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "ORGANIZATION",

    code:
      "company.organization_unit.view",

    name:
      "View Organization",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * COMPANY PERMISSION CATALOG
   * =========================================================
   */

  {
    module:
      "PERMISSION",

    code:
      "company.permission.view",

    name:
      "View Permissions",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * PLATFORM PERMISSIONS
   * =========================================================
   */

  {
    module:
      "PLATFORM_PERMISSION",

    code:
      "platform.permission.create",

    name:
      "Create Permissions",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_PERMISSION",

    code:
      "platform.permission.delete",

    name:
      "Delete Permissions",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_PERMISSION",

    code:
      "platform.permission.update",

    name:
      "Update Permissions",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_PERMISSION",

    code:
      "platform.permission.view",

    name:
      "View Permissions",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },


  /*
   * =========================================================
   * PLATFORM ROLE
   * =========================================================
   */

  {
    module:
      "PLATFORM_ROLE",

    code:
      "platform.platform_role.create",

    name:
      "Create Platform Role",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_ROLE",

    code:
      "platform.platform_role.delete",

    name:
      "Delete Platform Role",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_ROLE",

    code:
      "platform.platform_role.update",

    name:
      "Platform Role Update",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_ROLE",

    code:
      "platform.platform_role.view",

    name:
      "View Platform Roles",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_ROLE",

    code:
      "system.role.assign_permission",

    name:
      "Assign System Role Permission",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },


  /*
   * =========================================================
   * PLATFORM SUBSCRIPTION PLAN
   * =========================================================
   */

  {
    module:
      "PLATFORM_SUBSCRIPTION_PLAN",

    code:
      "platform.subscription_plan.create",

    name:
      "Create Subscription Plan",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_SUBSCRIPTION_PLAN",

    code:
      "platform.subscription_plan.delete",

    name:
      "Delete Subscription Plan",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_SUBSCRIPTION_PLAN",

    code:
      "platform.subscription_plan.update",

    name:
      "Update Subscription Plan",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_SUBSCRIPTION_PLAN",

    code:
      "platform.subscription_plan.view",

    name:
      "View Subscription Plan",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },


  /*
   * =========================================================
   * PLATFORM USER
   * =========================================================
   */

  {
    module:
      "PLATFORM_USER",

    code:
      "platform.user.create",

    name:
      "Create Platform User",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_USER",

    code:
      "platform.user.delete",

    name:
      "Delete Platform User",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_USER",

    code:
      "platform.user.update",

    name:
      "Update Platform User",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },

  {
    module:
      "PLATFORM_USER",

    code:
      "platform.user.view",

    name:
      "View Platform User",

    type:
      PermissionType.PLATFORM,

    allowedScopes: [],
  },


  /*
   * =========================================================
   * PROJECT
   *
   * PROJECT scope added where an
   * existing project can be managed
   * by project-scoped managers.
   * =========================================================
   */

  {
    module:
      "PROJECT",

    code:
      "company.project.create",

    name:
      "Company Project Create",

    type:
      PermissionType.COMPANY,

    /*
     * Creating a new project has no
     * existing PROJECT boundary yet.
     */
    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT",

    code:
      "company.project.delete",

    name:
      "Company Project Delete",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT",

    code:
      "company.project.update",

    name:
      "Company Project Update",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT",

    code:
      "company.project.view",

    name:
      "Company Project View",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * PROJECT CATEGORY
   * =========================================================
   */

  {
    module:
      "PROJECT_CATEGORY",

    code:
      "company.project_category.create",

    name:
      "Create Project Category",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_CATEGORY",

    code:
      "company.project_category.delete",

    name:
      "Delete Project Category",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_CATEGORY",

    code:
      "company.project_category.update",

    name:
      "Update Project Category",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_CATEGORY",

    code:
      "company.project_category.view",

    name:
      "View Project Categories",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * PROJECT ROLE
   *
   * ProjectRole remains responsibility/context,
   * not authorization.
   * =========================================================
   */

  {
    module:
      "PROJECT_ROLE",

    code:
      "company.project_role.create",

    name:
      "Create Project Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_ROLE",

    code:
      "company.project_role.delete",

    name:
      "Delete Project Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_ROLE",

    code:
      "company.project_role.update",

    name:
      "Update Project Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "PROJECT_ROLE",

    code:
      "company.project_role.view",

    name:
      "View Project Roles",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
    ],
  },


  /*
   * =========================================================
   * COMPANY ROLE
   *
   * Existing OWN scope preserved for now.
   * We can audit/remove it separately
   * without mixing that migration here.
   * =========================================================
   */

  {
    module:
      "ROLE",

    code:
      "company.role.create",

    name:
      "Create Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
    ],
  },

  {
    module:
      "ROLE",

    code:
      "company.role.delete",

    name:
      "Delete Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
    ],
  },

  {
    module:
      "ROLE",

    code:
      "company.role.update",

    name:
      "Update Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
    ],
  },

  {
    module:
      "ROLE",

    code:
      "company.role.view",

    name:
      "View Role",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
    ],
  },


  /*
   * =========================================================
   * TASK
   * =========================================================
   */

  /*
   * Manager/project planning.
   */
  {
    module:
      "TASK",

    code:
      "company.task.create",

    name:
      "Create Task",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  /*
   * Personal + management visibility.
   */
  {
    module:
      "TASK",

    code:
      "company.task.view",

    name:
      "Task View",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.OWN,
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  /*
   * Manager planning + completion review.
   */
  {
    module:
      "TASK",

    code:
      "company.task.update",

    name:
      "Update Task",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  {
    module:
      "TASK",

    code:
      "company.task.delete",

    name:
      "Delete Task",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.PROJECT,
      PermissionScope.COMPANY,
    ],
  },

  /*
   * Employee execution only.
   */
  {
    module:
      "TASK",

    code:
      "company.task.execute",

    name:
      "Execute Task",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.OWN,
    ],
  },


  /*
   * =========================================================
   * COMPANY USER
   * =========================================================
   */

  {
    module:
      "USER",

    code:
      "company.user.create",

    name:
      "Create User",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "USER",

    code:
      "company.user.delete",

    name:
      "Delete User",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "USER",

    code:
      "company.user.update",

    name:
      "Update User",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "USER",

    code:
      "company.user.view",

    name:
      "View Users",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.OWN,
      PermissionScope.TEAM,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "USER",

    code:
      "company.user_permission.update",

    name:
      "Update User Permissions",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },

  {
    module:
      "USER",

    code:
      "company.user_permission.view",

    name:
      "View User Permissions",

    type:
      PermissionType.COMPANY,

    allowedScopes: [
      PermissionScope.COMPANY,
      PermissionScope.ORGANIZATION_UNIT,
    ],
  },
];