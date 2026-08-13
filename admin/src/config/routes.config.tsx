import type { ReactNode } from "react";

import LoginPage from "@/modules/auth/pages/LoginPage";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";

import CompanyListPage from "@/modules/company/pages/CompanyListPage";
import CompanyCreatePage from "@/modules/company/pages/CompanyCreatePage";
import OrganizationUnitPage from "@/modules/organization-unit/pages/OrganizationUnitPage";
import RoleListPage from "@/modules/role/pages/RoleListPage";
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
import RolePermissionPage from "@/modules/role/pages/RolePermissionPage";
import ProjectCategoryListPage from "@/modules/project-category/pages/ProjectCategoryPage";
import ProfilePage from "@/modules/profile/pages/ProfilePage";
import UserListPage from "@/modules/users/pages/UserListPage";
import PlatformUserPage from "@/modules/platform-user/pages/PlatformUserPage";
import ProjectRoleListPage from "@/modules/project-role/pages/ProjectRoleListPage";
import PlatformRolePage from "@/modules/platform-role/pages/PlatformRolePage";

import PermissionRoute from "@/shared/components/guards/PermissionRoute";

export interface AppRoute {
  path: string;
  element: ReactNode;
}

export const publicRoutes: AppRoute[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export const protectedRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },

  {
    path: "/companies",
    element: <CompanyListPage />,
  },
  {
    path: "/companies/create",
    element: <CompanyCreatePage />,
  },

  {
    path: "/companies/:companyId/roles",
    element: <RoleListPage />,
  },

  {
    path: "/settings/organization-units",
    element: <OrganizationUnitPage />,
  },

  {
    path: "/companies/:companyId/roles/:roleId/permissions",
    element: <RolePermissionPage />,
  },

  {
    path: "/subscription-plans/:subscriptionPlanId/modules",
    element: <SubscriptionModulePage />,
  },

  {
    path: "/modules",
    element: <ModuleListPage />,
  },

  {
    path: "/subscription-plans",
    element: <SubscriptionPlanListPage />,
  },

  {
    path: "/master/states",
    element: <StateListPage />,
  },

  {
    path: "/master/cities",
    element: <CityListPage />,
  },

  {
    path: "/clients",

    element: (
    <PermissionRoute permission="company.client.view">
      <ClientListPage />
    </PermissionRoute>
  ),
  },

  {
    path: "/projects",
    element: (
    <PermissionRoute permission="company.project.view">
      <ProjectListPage />
    </PermissionRoute>
  ),
    
  },

    {
    path: "/project-categories",
     element: (
    <PermissionRoute permission="company.project_category.view">
      <ProjectCategoryListPage />
    </PermissionRoute>
  ),
  },

  {
    path: "/settings/company-profile",
    element: <CompanyProfilePage />,
  },



{
  path: "/departments",
  element: (
    <PermissionRoute permission="company.department.view">
      <DepartmentPage />
    </PermissionRoute>
  ),
},

  {
    path: "/designations",

    element: (
    <PermissionRoute permission="company.designation.view">
      <DesignationPage />
    </PermissionRoute>
  ),
  },

  {
    path: "/employees",
    element: (
    <PermissionRoute permission="company.employee.view">
      <EmployeePage />
    </PermissionRoute>
  ),
  },

  {
    path: "/settings/permissions",
    element: <PermissionPage />,
  },

  {
    path: "/settings/roles",
    element: <RoleListPage />,
  },

  {
    path: "/settings/roles/:uuid/permissions",
    element: <RolePermissionPage />,
  },



  {
    path: "/project-roles",
    element: <ProjectRoleListPage />,
  },

  {
    path: "/settings/profile",
    element: <ProfilePage />,
  },

  {
    path: "/settings/users",
    element: <UserListPage />,
  },

  {
    path: "/settings/platform-users",
    element: <PlatformUserPage />,
  },

  {
  path: "/platform-roles",
  element: <PlatformRolePage />,
  }
];
