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
import RoleListPagePage from "@/modules/role/pages/RoleListPage";
import RolePermissionPage from "@/modules/role/pages/RolePermissionPage";



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
  element: < RoleListPage/>,
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
    element: <ClientListPage />,
  },


  {
  path: "/projects",
  element: <ProjectListPage />,
},

{
  path: "/settings/company-profile",
  element: <CompanyProfilePage />,
},

{
  path: "/designations",
  element: <DesignationPage />,
},

{

   path: "/departments",
  element: <DepartmentPage />,
},

{
  path: "/employees",
  element: <EmployeePage />,
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





  
];