import type {
  ReactNode,
} from "react";

import LoginPage from "@/modules/auth/pages/LoginPage";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";

import CompanyListPage from "@/modules/company/pages/CompanyListPage";
import CompanyCreatePage from "@/modules/company/pages/CompanyCreatePage";

import OrganizationUnitPage from "@/modules/organization-unit/pages/OrganizationUnitPage";

import RoleListPage from "@/modules/role/pages/RoleListPage";
import RolePermissionPage from "@/modules/role/pages/RolePermissionPage";

import SubscriptionModulePage from "@/modules/subscription/pages/SubscriptionModulePage";

import ModuleListPage from "@/modules/module/pages/ModuleListPage";

import SubscriptionPlanListPage from "@/modules/subscription-plan/pages/SubscriptionPlanListPage";

import StateListPage from "@/modules/master/state/pages/StateListPage";
import CityListPage from "@/modules/master/city/pages/CityListPage";

import ClientListPage from "@/modules/client/pages/ClientListPage";

import ProjectListPage from "@/modules/project/pages/ProjectListPage";

import CompanyProfilePage from "@/modules/company/pages/CompanyProfilePage";

import DesignationPage from "@/modules/designation/pages/DesignationPage";

import DepartmentPage from "@/modules/department/pages/DepartmentPage";

import EmployeePage from "@/modules/employee/pages/EmployeePage";

import PermissionPage from "@/modules/permission/pages/PermissionPage";

import ProjectCategoryListPage from "@/modules/project-category/pages/ProjectCategoryPage";

import ProfilePage from "@/modules/profile/pages/ProfilePage";

import UserListPage from "@/modules/users/pages/UserListPage";

import PlatformUserPage from "@/modules/platform-user/pages/PlatformUserPage";

import ProjectRoleListPage from "@/modules/project-role/pages/ProjectRoleListPage";

import PlatformRolePage from "@/modules/platform-role/pages/PlatformRolePage";


import PermissionRoute from "@/shared/components/guards/PermissionRoute";

import PortalRoute from "@/shared/components/guards/PortalRoute";

import MyTaskPage from "@/modules/project-task/pages/MyTaskPage";


export interface AppRoute {
  path: string;
  element: ReactNode;
}


export const publicRoutes:
  AppRoute[] = [
  {
    path:
      "/login",

    element:
      <LoginPage />,
  },
];


export const protectedRoutes:
  AppRoute[] = [
  /*
   * =========================
   * SHARED ROUTES
   * =========================
   */

  {
    path:
      "/dashboard",

    element:
      <DashboardPage />,
  },


  {
    path:
      "/settings/profile",

    element:
      <ProfilePage />,
  },


  /*
   * =========================
   * PLATFORM PORTAL
   * =========================
   */

  {
  path:
    "/companies",

  element: (
    <PortalRoute portal="PLATFORM">
      <PermissionRoute
        permission="platform.company.view"
      >
        <CompanyListPage />
      </PermissionRoute>
    </PortalRoute>
  ),
},


{
  path:
    "/companies/create",

  element: (
    <PortalRoute portal="PLATFORM">
      <PermissionRoute
        permission="platform.company.create"
      >
        <CompanyCreatePage />
      </PermissionRoute>
    </PortalRoute>
  ),
},


  /*
   * Platform owner kisi company
   * ke roles inspect/manage kar raha hai.
   */
  {
    path:
      "/companies/:companyId/roles",

    element: (
      <PortalRoute portal="PLATFORM">
        <RoleListPage />
      </PortalRoute>
    ),
  },


  {
    path:
      "/companies/:companyId/roles/:roleId/permissions",

    element: (
      <PortalRoute portal="PLATFORM">
        <RolePermissionPage />
      </PortalRoute>
    ),
  },


{
  path:
    "/modules",

  element: (
    <PortalRoute portal="PLATFORM">
      <PermissionRoute
        permission="platform.module.view"
      >
        <ModuleListPage />
      </PermissionRoute>
    </PortalRoute>
  ),
},


{
  path:
    "/subscription-plans",

  element: (
    <PortalRoute portal="PLATFORM">
      <PermissionRoute
        permission="platform.subscription_plan.view"
      >
        <SubscriptionPlanListPage />
      </PermissionRoute>
    </PortalRoute>
  ),
},


  {
    path:
      "/subscription-plans/:subscriptionPlanId/modules",

    element: (
      <PortalRoute portal="PLATFORM">
        <SubscriptionModulePage />
      </PortalRoute>
    ),
  },


  {
    path:
      "/master/states",

    element: (
      <PortalRoute portal="PLATFORM">
        <StateListPage />
      </PortalRoute>
    ),
  },


  {
    path:
      "/master/cities",

    element: (
      <PortalRoute portal="PLATFORM">
        <CityListPage />
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/permissions",

    element: (
      <PortalRoute portal="PLATFORM">
        <PermissionRoute
          permission="platform.permission.view"
         >
       <PermissionPage />
      </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/platform-users",

    element: (
      <PortalRoute portal="PLATFORM">
        <PlatformUserPage />
      </PortalRoute>
    ),
  },


  {
    path:
      "/platform-roles",

    element: (
      <PortalRoute portal="PLATFORM">
        <PlatformRolePage />
      </PortalRoute>
    ),
  },


  /*
   * =========================
   * COMPANY PORTAL
   * =========================
   */

  {
    path:
      "/clients",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.client.view"
        >
          <ClientListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/projects",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.project.view"
        >
          <ProjectListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/project-categories",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.project_category.view"
        >
          <ProjectCategoryListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/project-roles",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.project_role.view"
        >
          <ProjectRoleListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/departments",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.department.view"
        >
          <DepartmentPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/designations",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.designation.view"
        >
          <DesignationPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
  path: "/my-tasks",

  element: (
    <PortalRoute portal="COMPANY">
      <PermissionRoute
        permission="company.task.view"
      >
        <MyTaskPage />
      </PermissionRoute>
    </PortalRoute>
  ),
},


  {
    path:
      "/employees",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.employee.view"
        >
          <EmployeePage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/users",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.user.view"
        >
          <UserListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/organization-units",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.organization_unit.view"
        >
          <OrganizationUnitPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/roles",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.role.view"
        >
          <RoleListPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  /*
   * Role permission assignment
   * role update operation hai.
   */
  {
    path:
      "/settings/roles/:uuid/permissions",

    element: (
      <PortalRoute portal="COMPANY">
        <PermissionRoute
          permission="company.role.update"
        >
          <RolePermissionPage />
        </PermissionRoute>
      </PortalRoute>
    ),
  },


  {
    path:
      "/settings/company-profile",

    element: (
      <PortalRoute portal="COMPANY">
        <CompanyProfilePage />
      </PortalRoute>
    ),
  },
];